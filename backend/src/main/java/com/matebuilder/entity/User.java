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
@TableName("tb_user")
@ApiModel(value = "User对象", description = "用户表")
public class User extends BaseEntity {
    
    @TableId(value = "id", type = IdType.AUTO)
    @ApiModelProperty(value = "用户ID")
    private Integer id;
    
    @ApiModelProperty(value = "用户名（私人账号）")
    private String privateUsername;
    
    @ApiModelProperty(value = "用户名（公共账号）")
    private String publicUsername;
    
    @ApiModelProperty(value = "密码哈希")
    private String passwordHash;
    
    @ApiModelProperty(value = "钱包地址")
    private String walletAddress;
    
    @ApiModelProperty(value = "能力描述")
    private String abilityDescription;
    
    @ApiModelProperty(value = "等级")
    private Integer level;
}
