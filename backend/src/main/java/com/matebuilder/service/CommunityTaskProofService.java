package com.matebuilder.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.matebuilder.entity.CommunityTaskProof;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface CommunityTaskProofService extends IService<CommunityTaskProof> {
    /**
     * 上传任务凭证
     * @param communityId 社区ID
     * @param memberId 成员ID
     * @param taskTitle 任务标题
     * @param taskDescription 任务描述
     * @param proofFile 凭证文件
     * @return 保存的凭证信息
     */
    CommunityTaskProof uploadTaskProof(Integer communityId, Integer memberId, String taskTitle, 
                                     String taskDescription, MultipartFile proofFile);

    /**
     * 获取成员的任务凭证列表
     * @param memberId 成员ID
     * @return 凭证列表
     */
    List<CommunityTaskProof> getMemberTaskProofs(Integer memberId);

    /**
     * 获取社区的任务凭证列表
     * @param communityId 社区ID
     * @return 凭证列表
     */
    List<CommunityTaskProof> getCommunityTaskProofs(Integer communityId);
}
