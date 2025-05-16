package com.matebuilder.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.matebuilder.common.api.R;
import com.matebuilder.entity.CommunityLabel;
import com.matebuilder.service.ICommunityLabelService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community-label")
@Api(tags = "社区标签管理")
public class CommunityLabelController {
    
    @Autowired
    private ICommunityLabelService communityLabelService;

    @ApiOperation("分页查询社区标签")
    @GetMapping("/list")
    public R<Page<CommunityLabel>> list(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页数量") @RequestParam(defaultValue = "10") Integer size) {
        Page<CommunityLabel> page = new Page<>(current, size);
        return R.ok(communityLabelService.page(page));
    }

    @ApiOperation("获取社区标签详情")
    @GetMapping("/{id}")
    public R<CommunityLabel> getById(@ApiParam("标签ID") @PathVariable Integer id) {
        return R.ok(communityLabelService.getById(id));
    }

    @ApiOperation("创建社区标签")
    @PostMapping
    public R<Boolean> save(@ApiParam("社区标签信息") @RequestBody CommunityLabel communityLabel) {
        return R.ok(communityLabelService.save(communityLabel));
    }

    @ApiOperation("更新社区标签")
    @PutMapping
    public R<Boolean> update(@ApiParam("社区标签信息") @RequestBody CommunityLabel communityLabel) {
        return R.ok(communityLabelService.updateById(communityLabel));
    }

    @ApiOperation("删除社区标签")
    @DeleteMapping("/{id}")
    public R<Boolean> delete(@ApiParam("标签ID") @PathVariable Integer id) {
        return R.ok(communityLabelService.removeById(id));
    }
}
