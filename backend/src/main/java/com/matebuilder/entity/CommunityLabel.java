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
@TableName("tb_community_label")
@ApiModel(value = "CommunityLabel对象", description = "社区标签表")
public class CommunityLabel extends BaseEntity {
    
    @TableId(value = "id", type = IdType.AUTO)
    @ApiModelProperty(value = "社区标签ID")
    private Integer id;
    
    @ApiModelProperty(value = "社区标签名称")
    private String labelName;
}
