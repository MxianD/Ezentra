package com.matebuilder.utils;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import io.ipfs.multihash.Multihash;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * IPFS工具类
 * 当本地未运行 IPFS 守护进程时，bean 仍可创建，但调用上传/下载方法会抛出异常。
 */
@Slf4j
@Component
public class IPFSUtil {

    private final IPFS ipfs;
    private final String ipfsNodeUrl;

    public IPFSUtil(@Value("${ipfs.node.url:/ip4/127.0.0.1/tcp/5001}") String ipfsNodeUrl) {
        this.ipfsNodeUrl = ipfsNodeUrl;
        IPFS instance = null;
        try {
            instance = new IPFS(ipfsNodeUrl);
            log.info("IPFS daemon connected at {}", ipfsNodeUrl);
        } catch (Exception e) {
            log.warn("IPFS daemon not available at {}. IPFS features will be disabled. Error: {}", ipfsNodeUrl, e.getMessage());
        }
        this.ipfs = instance;
    }

    /**
     * 检查 IPFS 是否可用
     */
    public boolean isAvailable() {
        return ipfs != null;
    }

    private void ensureAvailable() {
        if (ipfs == null) {
            throw new IllegalStateException("IPFS is not available. Please start IPFS daemon or set ipfs.node.url. (Expected: " + ipfsNodeUrl + ")");
        }
    }

    /**
     * 上传文件到IPFS
     *
     * @param file 文件
     * @return IPFS哈希值
     */
    public String uploadFile(MultipartFile file) {
        ensureAvailable();
        try {
            NamedStreamable.InputStreamWrapper is = new NamedStreamable.InputStreamWrapper(file.getInputStream());
            MerkleNode response = ipfs.add(is).get(0);
            return response.hash.toString();
        } catch (IOException e) {
            log.error("Upload file to IPFS failed", e);
            throw new RuntimeException("Upload file to IPFS failed", e);
        }
    }

    /**
     * 上传字节数组到IPFS
     *
     * @param data 字节数组
     * @return IPFS哈希值
     */
    public String uploadBytes(byte[] data) {
        ensureAvailable();
        try {
            InputStream inputStream = new ByteArrayInputStream(data);
            NamedStreamable.InputStreamWrapper is = new NamedStreamable.InputStreamWrapper(inputStream);
            MerkleNode response = ipfs.add(is).get(0);
            return response.hash.toString();
        } catch (IOException e) {
            log.error("Upload bytes to IPFS failed", e);
            throw new RuntimeException("Upload bytes to IPFS failed", e);
        }
    }

    /**
     * 从IPFS获取文件
     *
     * @param hash IPFS哈希值
     * @return 字节数组
     */
    public byte[] getFile(String hash) {
        ensureAvailable();
        try {
            Multihash filePointer = Multihash.fromBase58(hash);
            return ipfs.cat(filePointer);
        } catch (IOException e) {
            log.error("Get file from IPFS failed", e);
            throw new RuntimeException("Get file from IPFS failed", e);
        }
    }
}
