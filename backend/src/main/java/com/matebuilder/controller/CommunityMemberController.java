package com.matebuilder.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.matebuilder.common.api.R;
import com.matebuilder.entity.CommunityMember;
import com.matebuilder.service.ICommunityMemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community-member")
@Api(tags = "社区成员管理")
public class CommunityMemberController {
    
    @Autowired
    private ICommunityMemberService communityMemberService;

    @ApiOperation("分页查询社区成员")
    @GetMapping("/list")
    public R<Page<CommunityMember>> list(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页数量") @RequestParam(defaultValue = "10") Integer size,
            @ApiParam("社区ID") @RequestParam(required = false) Integer communityId,
            @ApiParam("用户ID") @RequestParam(required = false) Integer userId) {
        Page<CommunityMember> page = new Page<>(current, size);
        QueryWrapper<CommunityMember> queryWrapper = new QueryWrapper<>();
        if (communityId != null) {
            queryWrapper.eq("community_id", communityId);
        }
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        return R.ok(communityMemberService.page(page, queryWrapper));
    }

    @ApiOperation("获取成员详情")
    @GetMapping("/{id}")
    public R<CommunityMember> getById(@ApiParam("成员ID") @PathVariable Integer id) {
        return R.ok(communityMemberService.getById(id));
    }

    @ApiOperation("添加社区成员")
    @PostMapping
    public R<Boolean> save(@ApiParam("成员信息") @RequestBody CommunityMember communityMember) {
        return R.ok(communityMemberService.save(communityMember));
    }

    @ApiOperation("更新成员信息")
    @PutMapping
    public R<Boolean> update(@ApiParam("成员信息") @RequestBody CommunityMember communityMember) {
        return R.ok(communityMemberService.updateById(communityMember));
    }

    @ApiOperation("删除社区成员")
    @DeleteMapping("/{id}")
    public R<Boolean> delete(@ApiParam("成员ID") @PathVariable Integer id) {
        return R.ok(communityMemberService.removeById(id));
    }
}
