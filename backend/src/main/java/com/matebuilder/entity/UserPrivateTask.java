package com.matebuilder.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tb_user_private_task")
@ApiModel(value = "UserPrivateTask对象", description = "用户私人任务表")
public class UserPrivateTask extends BaseEntity {
    
    @TableId(value = "id", type = IdType.AUTO)
    @ApiModelProperty(value = "任务ID")
    private Integer id;
    
    @ApiModelProperty(value = "用户ID")
    private Integer userId;
    
    @ApiModelProperty(value = "任务标题")
    private String taskTitle;
    
    @ApiModelProperty(value = "任务描述")
    private String taskDescription;
    
    @ApiModelProperty(value = "任务日期")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate taskDate;
    
    @ApiModelProperty(value = "任务状态：进行中/已完成")
    private String taskStatus;
    
    @ApiModelProperty(value = "任务优先级")
    private Integer priority;
    
    @ApiModelProperty(value = "计划开始时间", example = "13:30:00")
    @JsonFormat(pattern = "HH:mm:ss", timezone = "UTC")
    private String startTime;
    
    @ApiModelProperty(value = "计划结束时间", example = "14:30:00")
    @JsonFormat(pattern = "HH:mm:ss", timezone = "UTC")
    private String endTime;
    
    @ApiModelProperty(value = "实际完成时间")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime completionTime;
}
