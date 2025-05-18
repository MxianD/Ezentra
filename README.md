# Ezentra

# Ezentra - 去中心化自我提升平台

## 项目简介



Ezentra是一个基于区块链的去中心化自我提升平台，通过智能合约实现社区驱动的目标设定、进度追踪和奖励机制。平台采用创新的评分系统和代币激励模式，鼓励用户持续自我提升并互相帮助。

## 核心功能



### 1. 社区管理

- 创建目标导向型社区

- 灵活的社区参数设置

- 成员管理和权限控制

- 社区投票机制



### 2. 智能评分系统

- 基于信誉度的加权评分

- 异常值检测和处理

- 动态信誉度调整

- 最少评分人数要求



### 3. 代币经济

- 社区质押机制

- 奖励池管理

- 保证金系统

- 通过质押激励长期参与



## 技术架构



### 前端 (React)

\- 技术栈：

  \* React 18

  \* Redux状态管理

  \* Web3.js区块链交互

  \* Material-UI组件库

\- 主要功能：

  \* 社区交互界面

  \* 钱包连接集成

  \* 实时进度追踪

  \* 评分和反馈系统



### 后端 (Java)

\- 技术栈：

  \* Spring Boot

  \* MySQL数据库

  \* JWT认证

\- 主要功能：

  \* 用户管理

  \* 数据分析

  \* API接口

  \* 日志记录



### 智能合约 (Solidity)

\- 合约组件：

  \* `Community.sol`: 社区核心功能实现

  \* `SubmissionManager.sol`: 提交内容管理和评分系统

  \* `Senate.sol`: 治理和参数管理

\- 开发环境：

  \* Solidity ^0.8.20

  \* Hardhat

  \* Ethers.js

  \* Chai（测试框架）



## 快速开始



### 环境要求

\- Node.js >= 14.0.0

\- npm >= 6.0.0



### 安装

#### 克隆项目

```bash
git clone https://github.com/MxianD/Ezentra.git

cd Ezentra
```



#### 安装前端依赖

```bash
cd frontend

npm install
```





#### 安装智能合约依赖

```bash
cd ../contracts

npm install
```





#### 配置后端

```bash
cd ../backend

./mvnw install
```



### 测试

```bash
# 运行所有测试

npx hardhat test

# 运行特定测试文件

npx hardhat test test/SubmissionManager.test.js

# 运行测试并显示gas使用情况

REPORT_GAS=true npx hardhat test
```



### 部署

```bash
\# 启动前端

cd frontend

npm start



\# 启动后端

cd ../backend

./mvnw spring-boot:run



\# 部署智能合约

cd ../contracts



\# 启动本地节点

npx hardhat node



\# 部署合约

npx hardhat run scripts/deploy.js --network localhost
```



### 配置

1. 前端配置（`frontend/.env`）：

```env
REACT_APP_API_URL=http://localhost:8080

REACT_APP_CONTRACT_ADDRESS=部署后的合约地址
```





2. 后端配置（`backend/src/main/resources/application.properties`）：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ezentra

spring.datasource.username=root

spring.datasource.password=your_password
```



## 系统设计



### 评分系统

\- 初始信誉度：1000

\- 评分奖励：+50（准确评分）

\- 评分惩罚：-10（偏离评分）

\- 最少评分要求：3人



### 安全特性

\- 评分防篡改机制

\- 社区资金安全保护

\- 权限管理系统

\- 异常检测机制



## 贡献指南



1. Fork 项目

2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)

3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)

4. 推送到分支 (`git push origin feature/AmazingFeature`)

5. 开启 Pull Request



## 许可证



本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件



## 联系方式



项目维护者 - [@MxianD](https://github.com/MxianD) [@DVDguzhou](https://github.com/DVDguzhou)



项目链接: [https://github.com/MxianD/Ezentra](https://github.com/MxianD/Ezentra)