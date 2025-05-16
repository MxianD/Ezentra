package com.matebuilder.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tb_community_member")
@ApiModel(value = "CommunityMember对象", description = "社区成员表")
public class CommunityMember extends BaseEntity {
    
    @TableId(value = "id", type = IdType.AUTO)
    @ApiModelProperty(value = "成员ID")
    private Integer id;
    
    @ApiModelProperty(value = "社区ID")
    private Integer communityId;
    
    @ApiModelProperty(value = "用户ID")
    private Integer userId;
    
    @ApiModelProperty(value = "成员角色")
    private String memberRole;
}
