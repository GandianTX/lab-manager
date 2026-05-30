# 高校实验资源协同管理平台

基于前后端分离架构的高校实验资源协同管理平台设计与实现（毕业设计项目）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Ant Design 5 + ECharts + React Router 6 + Axios + Vite |
| 后端 | Egg.js 3 + Sequelize 6 + jsonwebtoken + bcryptjs |
| 数据库 | MySQL 8 |

## 功能模块

| 模块 | 功能 | admin | user |
|------|------|:-----:|:----:|
| 登录认证 | JWT 登录 / Token 校验 / 退出 | ✅ | ✅ |
| 仪表盘 | 用户/资源/借用统计 + 借用趋势折线图 + 资源分类饼图 (ECharts) | ✅ | ✅ |
| 用户管理 | 用户 CRUD（列表/新增/编辑/删除） | ✅ | ❌ |
| 个人信息 | 查看个人信息 / 修改密码 | ✅ | ✅ |
| 资源管理 | 资源 CRUD + 分类管理 | ✅ | 👁️ |
| 借用管理 | 提交申请 / 查看记录 / 归还 | ✅ | ✅ |
| 借用审批 | 审批通过 / 驳回 | ✅ | ❌ |
| 公告管理 | 发布公告 / 删除公告 | ✅ | 👁️ |

> 👁️ = 只读；❌ = 禁止访问（前后端双重校验）

## 权限模型

系统仅保留 `admin` 和 `user` 两种角色。

| 维度 | 实现方式 |
|------|----------|
| 后端 API | JWT 认证（`middleware/auth.js`）+ Service 层 role 校验，`403 Forbidden` |
| 前端路由 | `AuthGuard` 登录守卫 / `AdminGuard` 角色守卫 |
| 前端菜单 | `BasicLayout` 根据 `user.role` 动态切换 admin/user 两套菜单 |
| 页面按钮 | 新增/编辑/删除等操作按钮仅 admin 可见 |

## 项目结构

```
lab-manager/
├── server/
│   ├── app/
│   │   ├── controller/
│   │   │   ├── user.js              # 用户：登录/CRUD/自助修改
│   │   │   ├── resource.js          # 资源+分类 CRUD
│   │   │   ├── borrow.js            # 借用：申请/审批/归还
│   │   │   ├── notice.js            # 公告：发布/删除
│   │   │   └── dashboard.js         # 仪表盘统计
│   │   ├── service/
│   │   │   ├── user.js              # 用户业务逻辑 + 权限校验
│   │   │   ├── resource.js          # 资源+分类业务逻辑
│   │   │   ├── borrow.js            # 借用审批业务逻辑
│   │   │   ├── notice.js            # 公告业务逻辑
│   │   │   └── dashboard.js         # 统计数据聚合
│   │   ├── model/
│   │   │   ├── user.js              # user 表
│   │   │   ├── resource_category.js # resource_category 表
│   │   │   ├── resource.js          # resource 表
│   │   │   ├── borrow_record.js     # borrow_record 表
│   │   │   └── notice.js            # notice 表
│   │   ├── middleware/auth.js       # JWT 认证中间件
│   │   ├── extend/context.js        # 统一响应格式 (code:0/1)
│   │   ├── database/init.js         # 数据库初始化+种子数据
│   │   └── router.js                # 路由表
│   ├── config/
│   │   ├── config.default.js        # 数据库/JWT/CORS/中间件
│   │   └── plugin.js                # 插件声明
│   ├── app.js                       # sync({ alter: true })
│   └── package.json
├── client/
│   ├── src/
│   │   ├── layouts/
│   │   │   └── BasicLayout.jsx      # 动态菜单 + 侧边栏
│   │   ├── pages/
│   │   │   ├── Login/               # 登录页
│   │   │   ├── Dashboard/           # 仪表盘 (ECharts)
│   │   │   ├── User/                # 用户管理 (admin)
│   │   │   ├── Profile/             # 个人信息 (所有用户)
│   │   │   ├── Resource/            # 资源管理+分类
│   │   │   ├── Borrow/              # 借用管理
│   │   │   └── Notice/              # 公告管理
│   │   ├── services/
│   │   │   ├── user.js              # 用户 API
│   │   │   ├── resource.js          # 资源 API
│   │   │   ├── borrow.js            # 借用 API
│   │   │   ├── notice.js            # 公告 API
│   │   │   └── dashboard.js         # 统计 API
│   │   ├── utils/request.js         # Axios 封装 (code:0/1 + 401/403)
│   │   ├── App.jsx                  # 路由 + AuthGuard + AdminGuard
│   │   └── main.jsx                 # 入口
│   ├── index.html
│   ├── vite.config.js               # 代理 /api → 后端
│   └── package.json
└── README.md
```

## 架构分层（严格单向依赖）

```
┌────────────┐     ┌───────────┐     ┌─────────┐
│ controller │ ──→ │  service  │ ──→ │  model  │  后端
└────────────┘     └───────────┘     └─────────┘
                                               
┌────────┐     ┌──────────┐     ┌───────────┐
│ pages  │ ──→ │ services │ ──→ │ utils     │  前端
└────────┘     └──────────┘     └───────────┘
                                              → axios
```

- pages 不直接引用 axios / request
- controller 不直接操作 model
- middleware 不引用 controller
- model 不引用 service

## 数据库表设计

### 用户表 `user`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码（bcrypt 加密） |
| role | ENUM('admin','user') | 角色 |
| create_time | DATETIME | 创建时间 |

### 资源分类表 `resource_category`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 分类名称 |
| remark | VARCHAR(200) | 备注 |

### 资源表 `resource`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(100) | 资源名称 |
| category_id | INT | 分类ID，外键 |
| status | ENUM('idle','borrowed','repair') | 状态 |
| description | VARCHAR(500) | 描述 |
| create_time | DATETIME | 创建时间 |

### 借用记录表 `borrow_record`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 借用人ID |
| resource_id | INT | 资源ID |
| status | ENUM('pending','approved','rejected','returned') | 状态 |
| borrow_time | DATETIME | 借用时间 |
| return_time | DATETIME | 归还时间 |
| remark | VARCHAR(500) | 备注 |
| create_time | DATETIME | 创建时间 |

### 公告表 `notice`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(200) | 标题 |
| content | VARCHAR(2000) | 内容 |
| create_time | DATETIME | 发布时间 |

## 快速启动

### 1. 环境要求

- Node.js >= 16
- MySQL >= 8.0（或 MariaDB）

### 2. 安装依赖

```bash
cd server && npm install
cd ../client && npm install
```

### 3. 初始化数据库

```bash
cd server
node app/database/init.js
```

此操作会：
- 创建 `lab_manager` 数据库
- 使用 Sequelize `sync({ force: true })` 自动建表（不手写 SQL）
- 插入默认管理员和示例数据（4个分类、8项资源）

### 4. 启动后端

```bash
cd server
npm run dev
```

后端运行在 `http://127.0.0.1:7001`，启动时自动执行 `sync({ alter: true })` 同步表结构。

### 5. 启动前端

```bash
cd client
npm run dev
```

前端运行在 `http://localhost:3000`，API 请求通过 Vite proxy 转发到后端。

### 6. 默认账号

| 角色 | 账号 | 密码 | 权限 |
|------|------|------|------|
| 管理员 | admin | admin123 | 全部功能 |
| 普通用户 | - | - | 仅查看/借用/个人信息 |

> 普通用户需由管理员在「用户管理」页面创建。

## API 接口一览

### 统一响应格式

```json
// 成功
{ "code": 0, "message": "success", "data": {} }

// 失败
{ "code": 1, "message": "错误描述" }
```

分页接口统一参数：`pageNum` / `pageSize`，返回 `{ list, total, pageNum, pageSize }`。

### 用户模块 `/api/user`

| 方法 | 路径 | 说明 | 认证 | 权限 |
|------|------|------|:--:|:----:|
| POST | /login | 用户登录 | - | 公开 |
| GET | /info | 当前用户信息 | JWT | 登录 |
| PUT | /profile | 修改自己密码 | JWT | 登录 |
| GET | /list | 用户列表（分页） | JWT | admin |
| POST | /create | 创建用户 | JWT | admin |
| PUT | /update/:id | 更新用户 | JWT | admin |
| DELETE | /delete/:id | 删除用户 | JWT | admin |

### 资源管理 `/api/resource`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 资源列表（分页/搜索/分类筛选） | 登录 |
| POST | /create | 创建资源 | admin |
| PUT | /update/:id | 更新资源 | admin |
| DELETE | /delete/:id | 删除资源 | admin |

### 资源分类 `/api/resource/category`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 分类列表 | 登录 |
| POST | /create | 创建分类 | admin |
| PUT | /update/:id | 更新分类 | admin |
| DELETE | /delete/:id | 删除分类 | admin |

### 借用管理 `/api/borrow`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 借用列表（分页；user 仅看自己） | 登录 |
| POST | /create | 提交借用申请 | 登录 |
| PUT | /approve/:id | 审批通过 → resource.status='borrowed' | admin |
| PUT | /reject/:id | 驳回 | admin |
| PUT | /return/:id | 归还 → resource.status='idle' | 借用人/admin |

### 公告管理 `/api/notice`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 公告列表（分页） | 登录 |
| POST | /create | 发布公告 | admin |
| DELETE | /delete/:id | 删除公告 | admin |

### 仪表盘 `/api/dashboard`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /stats | 用户/资源/借用总数 + 趋势 + 分类分布 | 登录 |

## 建表方式

- 使用 Sequelize `sync({ alter: true })` 自动建表/更新表结构
- 不使用 migration，不手写 CREATE TABLE SQL
- 开发启动 (`npm run dev`) 自动同步

## 数据库重初始化

```bash
cd server && node app/database/init.js
```

> 此脚本使用 `sync({ force: true })` 清除旧表重建，仅用于首次部署或数据重置。
