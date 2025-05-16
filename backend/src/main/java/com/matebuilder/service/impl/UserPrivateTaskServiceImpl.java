package com.matebuilder.service.impl;

import com.matebuilder.entity.UserPrivateTask;
import com.matebuilder.mapper.UserPrivateTaskMapper;
import com.matebuilder.service.IUserPrivateTaskService;
import org.springframework.stereotype.Service;

@Service
public class UserPrivateTaskServiceImpl extends BaseServiceImpl<UserPrivateTaskMapper, UserPrivateTask> implements IUserPrivateTaskService {
}
