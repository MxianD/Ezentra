package com.matebuilder.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.matebuilder.entity.CommunityTaskProof;
import com.matebuilder.mapper.CommunityTaskProofMapper;
import com.matebuilder.service.CommunityTaskProofService;
import com.matebuilder.utils.IPFSUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityTaskProofServiceImpl extends ServiceImpl<CommunityTaskProofMapper, CommunityTaskProof> 
        implements CommunityTaskProofService {

    private final IPFSUtil ipfsUtil;

    @Override
    public CommunityTaskProof uploadTaskProof(Integer communityId, Integer memberId, String taskTitle,
                                            String taskDescription, MultipartFile proofFile) {
        try {
            // 上传文件到IPFS
            String proofHash = ipfsUtil.uploadFile(proofFile);
            
            // 创建凭证记录
            CommunityTaskProof proof = new CommunityTaskProof();
            proof.setCommunityId(communityId);
            proof.setMemberId(memberId);
            proof.setTaskTitle(taskTitle);
            proof.setTaskDescription(taskDescription);
            proof.setProofType(getProofType(proofFile.getContentType()));
            proof.setProofHash(proofHash);
            proof.setFileName(proofFile.getOriginalFilename());
            
            // 保存到数据库
            save(proof);
            
            return proof;
        } catch (Exception e) {
            throw new RuntimeException("上传凭证失败", e);
        }
    }

    @Override
    public List<CommunityTaskProof> getMemberTaskProofs(Integer memberId) {
        return list(new LambdaQueryWrapper<CommunityTaskProof>()
                .eq(CommunityTaskProof::getMemberId, memberId)
                .orderByDesc(CommunityTaskProof::getCreateTime));
    }

    @Override
    public List<CommunityTaskProof> getCommunityTaskProofs(Integer communityId) {
        return list(new LambdaQueryWrapper<CommunityTaskProof>()
                .eq(CommunityTaskProof::getCommunityId, communityId)
                .orderByDesc(CommunityTaskProof::getCreateTime));
    }

    private String getProofType(String mimeType) {
        if (mimeType == null) {
            return "document";
        }
        if (mimeType.startsWith("image/")) {
            return "image";
        }
        if (mimeType.startsWith("video/")) {
            return "video";
        }
        return "document";
    }
}
