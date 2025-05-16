package com.matebuilder.service.impl;

import com.matebuilder.entity.User;
import com.matebuilder.mapper.UserMapper;
import com.matebuilder.service.IUserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends BaseServiceImpl<UserMapper, User> implements IUserService {
}
