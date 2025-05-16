package com.matebuilder.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.matebuilder.common.api.R;
import com.matebuilder.entity.UserAbility;
import com.matebuilder.service.IUserAbilityService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-ability")
@Api(tags = "用户能力管理")
public class UserAbilityController {
    
    @Autowired
    private IUserAbilityService userAbilityService;

    @ApiOperation("分页查询用户能力")
    @GetMapping("/list")
    public R<Page<UserAbility>> list(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页数量") @RequestParam(defaultValue = "10") Integer size,
            @ApiParam("用户ID") @RequestParam(required = false) Integer userId) {
        Page<UserAbility> page = new Page<>(current, size);
        QueryWrapper<UserAbility> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        return R.ok(userAbilityService.page(page, queryWrapper));
    }

    @ApiOperation("获取用户能力详情")
    @GetMapping("/{id}")
    public R<UserAbility> getById(@ApiParam("能力ID") @PathVariable Integer id) {
        return R.ok(userAbilityService.getById(id));
    }

    @ApiOperation("创建用户能力")
    @PostMapping
    public R<Boolean> save(@ApiParam("用户能力信息") @RequestBody UserAbility userAbility) {
        return R.ok(userAbilityService.save(userAbility));
    }

    @ApiOperation("更新用户能力")
    @PutMapping
    public R<Boolean> update(@ApiParam("用户能力信息") @RequestBody UserAbility userAbility) {
        return R.ok(userAbilityService.updateById(userAbility));
    }

    @ApiOperation("删除用户能力")
    @DeleteMapping("/{id}")
    public R<Boolean> delete(@ApiParam("能力ID") @PathVariable Integer id) {
        return R.ok(userAbilityService.removeById(id));
    }
}
