package com.matebuilder.utils;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.Assert;

import java.nio.charset.StandardCharsets;

@SpringBootTest
public class IPFSUtilTest {

    @Autowired
    private IPFSUtil ipfsUtil;

    @Test
    public void testUploadAndGetFile() {
        // 创建测试文件
        String content = "Hello IPFS!";
        MockMultipartFile file = new MockMultipartFile(
            "test.txt",
            "test.txt",
            "text/plain",
            content.getBytes(StandardCharsets.UTF_8)
        );

        try {
            // 上传文件到IPFS
            String hash = ipfsUtil.uploadFile(file);
            System.out.println("Uploaded file hash: " + hash);
            Assert.hasText(hash, "Hash should not be empty");

            // 从IPFS获取文件
            byte[] downloadedContent = ipfsUtil.getFile(hash);
            String downloadedString = new String(downloadedContent, StandardCharsets.UTF_8);
            System.out.println("Downloaded content: " + downloadedString);
            Assert.isTrue(content.equals(downloadedString), "Content should match");

            // 测试上传字节数组
            byte[] testBytes = "Test bytes".getBytes(StandardCharsets.UTF_8);
            String bytesHash = ipfsUtil.uploadBytes(testBytes);
            System.out.println("Uploaded bytes hash: " + bytesHash);
            Assert.hasText(bytesHash, "Bytes hash should not be empty");

            // 获取上传的字节数组
            byte[] downloadedBytes = ipfsUtil.getFile(bytesHash);
            String downloadedBytesString = new String(downloadedBytes, StandardCharsets.UTF_8);
            System.out.println("Downloaded bytes content: " + downloadedBytesString);
            Assert.isTrue("Test bytes".equals(downloadedBytesString), "Bytes content should match");

        } catch (Exception e) {
            e.printStackTrace();
            Assert.isTrue(false, "Test failed: " + e.getMessage());
        }
    }
}
