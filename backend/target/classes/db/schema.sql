-- 创建用户表
CREATE TABLE IF NOT EXISTS `tb_user` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `private_username` varchar(255) NOT NULL COMMENT '用户名（私人账号）',
    `public_username` varchar(255) NOT NULL COMMENT '用户名（公共账号）',
    `password_hash` varchar(255) NOT NULL COMMENT '密码哈希',
    `wallet_address` varchar(255) DEFAULT NULL COMMENT '钱包地址',
    `ability_description` varchar(255) DEFAULT NULL COMMENT '能力描述',
    `level` int DEFAULT '0' COMMENT '等级',
    `create_by` int DEFAULT NULL COMMENT '创建人',
    `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` int DEFAULT NULL COMMENT '修改人',
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_private_username` (`private_username`),
    UNIQUE KEY `uk_public_username` (`public_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';

-- 创建用户能力表
CREATE TABLE IF NOT EXISTS `tb_user_ability` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '能力等级ID',
    `user_id` int NOT NULL COMMENT '用户ID',
    `ability_name` varchar(255) NOT NULL COMMENT '子能力名称',
    `ability_score` decimal(10,2) DEFAULT '0.00' COMMENT '子能力分数',
    `create_by` int DEFAULT NULL COMMENT '创建人',
    `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` int DEFAULT NULL COMMENT '修改人',
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户能力表';

-- 创建社区标签表
CREATE TABLE IF NOT EXISTS `tb_community_label` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '社区标签ID',
    `label_name` varchar(255) NOT NULL COMMENT '社区标签名称',
    `create_by` int DEFAULT NULL COMMENT '创建人',
    `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` int DEFAULT NULL COMMENT '修改人',
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_label_name` (`label_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='社区标签表';

-- 创建用户社区表
CREATE TABLE IF NOT EXISTS `tb_user_community` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '社区ID',
    `user_id` int NOT NULL COMMENT '用户ID（创建者）',
    `community_name` varchar(255) NOT NULL COMMENT '社区名称',
    `community_description` text COMMENT '社区描述',
    `community_logo` MEDIUMBLOB COMMENT '社区logo图片数据',
    `community_label_id` int DEFAULT NULL COMMENT '社区标签',
    `expire_time` timestamp NULL DEFAULT NULL COMMENT '到期时间',
    `create_by` int DEFAULT NULL COMMENT '创建人',
    `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` int DEFAULT NULL COMMENT '修改人',
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_community_label_id` (`community_label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户社区表';

-- 创建社区成员表
CREATE TABLE IF NOT EXISTS `tb_community_member` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '成员ID',
    `community_id` int NOT NULL COMMENT '社区ID',
    `user_id` int NOT NULL COMMENT '用户ID',
    `member_role` enum('creator','member') NOT NULL DEFAULT 'member' COMMENT '成员角色',
    `create_by` int DEFAULT NULL COMMENT '创建人',
    `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` int DEFAULT NULL COMMENT '修改人',
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_community_user` (`community_id`,`user_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='社区成员表';

-- 创建用户私人任务表
CREATE TABLE IF NOT EXISTS `tb_user_private_task` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '任务ID',
    `user_id` int NOT NULL COMMENT '用户ID',
    `task_title` varchar(255) NOT NULL COMMENT '任务标题',
    `task_description` text COMMENT '任务描述',
    `task_date` date NOT NULL COMMENT '任务日期',
    `task_status` enum('in_progress','completed') NOT NULL DEFAULT 'in_progress' COMMENT '任务状态：进行中/已完成',
    `priority` int DEFAULT '0' COMMENT '任务优先级',
    `start_time` time DEFAULT NULL COMMENT '计划开始时间',
    `end_time` time DEFAULT NULL COMMENT '计划结束时间',
    `completion_time` timestamp NULL DEFAULT NULL COMMENT '实际完成时间',
    `create_by` int DEFAULT NULL COMMENT '创建人',
    `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` int DEFAULT NULL COMMENT '修改人',
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_date` (`user_id`, `task_date`),
    KEY `idx_status` (`task_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户私人任务表';
