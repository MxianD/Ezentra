package com.matebuilder.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.matebuilder.common.api.R;
import com.matebuilder.entity.User;
import com.matebuilder.service.IUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Api(tags = "用户管理")
public class UserController {
    
    @Autowired
    private IUserService userService;

    @ApiOperation("分页查询用户")
    @GetMapping("/list")
    public R<Page<User>> list(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页数量") @RequestParam(defaultValue = "10") Integer size) {
        Page<User> page = new Page<>(current, size);
        return R.ok(userService.page(page));
    }

    @ApiOperation("获取用户详情")
    @GetMapping("/{id}")
    public R<User> getById(@ApiParam("用户ID") @PathVariable Integer id) {
        return R.ok(userService.getById(id));
    }

    @ApiOperation("创建用户")
    @PostMapping
    public R<Boolean> save(@ApiParam("用户信息") @RequestBody User user) {
        return R.ok(userService.save(user));
    }

    @ApiOperation("更新用户")
    @PutMapping
    public R<Boolean> update(@ApiParam("用户信息") @RequestBody User user) {
        return R.ok(userService.updateById(user));
    }

    @ApiOperation("删除用户")
    @DeleteMapping("/{id}")
    public R<Boolean> delete(@ApiParam("用户ID") @PathVariable Integer id) {
        return R.ok(userService.removeById(id));
    }
}
