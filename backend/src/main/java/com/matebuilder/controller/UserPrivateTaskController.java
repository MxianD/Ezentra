package com.matebuilder.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.matebuilder.common.api.R;
import com.matebuilder.entity.UserPrivateTask;
import com.matebuilder.service.IUserPrivateTaskService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/user-private-task")
@Api(tags = "用户私人任务管理")
public class UserPrivateTaskController {
    
    @Autowired
    private IUserPrivateTaskService userPrivateTaskService;

    @ApiOperation("分页查询用户任务")
    @GetMapping("/list")
    public R<Page<UserPrivateTask>> list(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页数量") @RequestParam(defaultValue = "10") Integer size,
            @ApiParam("用户ID") @RequestParam(required = false) Integer userId,
            @ApiParam("任务状态") @RequestParam(required = false) String taskStatus,
            @ApiParam("任务日期") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate taskDate) {
        
        Page<UserPrivateTask> page = new Page<>(current, size);
        QueryWrapper<UserPrivateTask> queryWrapper = new QueryWrapper<>();
        
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        if (taskStatus != null) {
            queryWrapper.eq("task_status", taskStatus);
        }
        if (taskDate != null) {
            queryWrapper.eq("task_date", taskDate);
        }
        
        queryWrapper.orderByDesc("priority")
                   .orderByAsc("task_date");
        
        return R.ok(userPrivateTaskService.page(page, queryWrapper));
    }

    @ApiOperation("获取任务详情")
    @GetMapping("/{id}")
    public R<UserPrivateTask> getById(@ApiParam("任务ID") @PathVariable Integer id) {
        return R.ok(userPrivateTaskService.getById(id));
    }

    @ApiOperation("创建任务")
    @PostMapping
    public R<Boolean> save(@ApiParam("任务信息") @RequestBody UserPrivateTask userPrivateTask) {
        return R.ok(userPrivateTaskService.save(userPrivateTask));
    }

    @ApiOperation("更新任务")
    @PutMapping
    public R<Boolean> update(@ApiParam("任务信息") @RequestBody UserPrivateTask userPrivateTask) {
        return R.ok(userPrivateTaskService.updateById(userPrivateTask));
    }

    @ApiOperation("删除任务")
    @DeleteMapping("/{id}")
    public R<Boolean> delete(@ApiParam("任务ID") @PathVariable Integer id) {
        return R.ok(userPrivateTaskService.removeById(id));
    }

    @ApiOperation("更新任务状态")
    @PutMapping("/{id}/status")
    public R<Boolean> updateStatus(
            @ApiParam("任务ID") @PathVariable Integer id,
            @ApiParam("任务状态") @RequestParam String taskStatus) {
        UserPrivateTask task = new UserPrivateTask();
        task.setId(id);
        task.setTaskStatus(taskStatus);
        if ("completed".equals(taskStatus)) {
            task.setCompletionTime(LocalDateTime.now());
        }
        return R.ok(userPrivateTaskService.updateById(task));
    }

    @ApiOperation("获取用户当天任务列表")
    @GetMapping("/today/{userId}")
    public R<List<UserPrivateTask>> getTodayTasks(@ApiParam("用户ID") @PathVariable Integer userId) {
        QueryWrapper<UserPrivateTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                   .eq("task_date", LocalDate.now())
                   .orderByDesc("priority")
                   .orderByAsc("start_time");
        return R.ok(userPrivateTaskService.list(queryWrapper));
    }
}
