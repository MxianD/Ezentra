package com.matebuilder.service.impl;

import com.matebuilder.entity.CommunityMember;
import com.matebuilder.mapper.CommunityMemberMapper;
import com.matebuilder.service.ICommunityMemberService;
import org.springframework.stereotype.Service;

@Service
public class CommunityMemberServiceImpl extends BaseServiceImpl<CommunityMemberMapper, CommunityMember> implements ICommunityMemberService {
}
