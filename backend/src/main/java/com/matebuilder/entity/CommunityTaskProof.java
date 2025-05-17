package com.matebuilder.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("tb_community_task_proof")
public class CommunityTaskProof {
    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private Integer communityId;
    
    private Integer memberId;
    
    private String taskTitle;
    
    private String taskDescription;
    
    private String proofType;
    
    private String proofHash;
    
    private String fileName;
    
    private Integer createBy;
    
    private LocalDateTime createTime;
    
    private Integer updateBy;
    
    private LocalDateTime updateTime;
}
