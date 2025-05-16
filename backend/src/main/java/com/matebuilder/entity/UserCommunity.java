package com.matebuilder.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tb_user_community")
@ApiModel(value = "UserCommunity对象", description = "用户社区表")
public class UserCommunity extends BaseEntity {
    
    @TableId(value = "id", type = IdType.AUTO)
    @ApiModelProperty(value = "社区ID")
    private Integer id;
    
    @ApiModelProperty(value = "用户ID（创建者）")
    private Integer userId;
    
    @ApiModelProperty(value = "社区名称")
    private String communityName;
    
    @ApiModelProperty(value = "社区描述")
    private String communityDescription;
    
    @ApiModelProperty(value = "社区logo图片数据")
    private byte[] communityLogo;
    
    @ApiModelProperty(value = "社区标签")
    private Integer communityLabelId;
    
    @ApiModelProperty(value = "到期时间")
    private LocalDateTime expireTime;
}
