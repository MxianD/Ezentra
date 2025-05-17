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
 */
@Slf4j
@Component
public class IPFSUtil {

    private final IPFS ipfs;

    public IPFSUtil(@Value("${ipfs.node.url:/ip4/127.0.0.1/tcp/5001}") String ipfsNodeUrl) {
        this.ipfs = new IPFS(ipfsNodeUrl);
    }

    /**
     * 上传文件到IPFS
     *
     * @param file 文件
     * @return IPFS哈希值
     */
    public String uploadFile(MultipartFile file) {
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
        try {
            Multihash filePointer = Multihash.fromBase58(hash);
            return ipfs.cat(filePointer);
        } catch (IOException e) {
            log.error("Get file from IPFS failed", e);
            throw new RuntimeException("Get file from IPFS failed", e);
        }
    }
}
