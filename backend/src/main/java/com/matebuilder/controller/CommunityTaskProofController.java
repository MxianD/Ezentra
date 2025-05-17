package com.matebuilder.controller;

import com.matebuilder.common.api.R;
import com.matebuilder.entity.CommunityTaskProof;
import com.matebuilder.service.CommunityTaskProofService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Tag(name = "社区任务凭证")
@RestController
@RequestMapping("/api/community/task/proof")
@RequiredArgsConstructor
public class CommunityTaskProofController {

    private final CommunityTaskProofService communityTaskProofService;

    @Operation(summary = "上传任务凭证")
    @PostMapping("/upload")
    public R<CommunityTaskProof> uploadTaskProof(
            @RequestParam Integer communityId,
            @RequestParam Integer memberId,
            @RequestParam String taskTitle,
            @RequestParam(required = false) String taskDescription,
            @RequestParam MultipartFile proofFile) {
        CommunityTaskProof proof = communityTaskProofService.uploadTaskProof(
                communityId, memberId, taskTitle, taskDescription, proofFile);
        return R.ok(proof);
    }

    @Operation(summary = "获取成员的任务凭证列表")
    @GetMapping("/member/{memberId}")
    public R<List<CommunityTaskProof>> getMemberTaskProofs(@PathVariable Integer memberId) {
        List<CommunityTaskProof> proofs = communityTaskProofService.getMemberTaskProofs(memberId);
        return R.ok(proofs);
    }

    @Operation(summary = "获取社区的任务凭证列表")
    @GetMapping("/community/{communityId}")
    public R<List<CommunityTaskProof>> getCommunityTaskProofs(@PathVariable Integer communityId) {
        List<CommunityTaskProof> proofs = communityTaskProofService.getCommunityTaskProofs(communityId);
        return R.ok(proofs);
    }
}
