# 高校实验资源协同管理平台

基于前后端分离架构的高校实验资源协同管理平台设计与实现（毕业设计项目）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Ant Design 5 + ECharts + React Router 6 + Axios + Vite |
| 后端 | Egg.js 3 + TypeScript + Sequelize 6 + JWT + bcryptjs |
| 数据库 | MySQL 8 |

## 功能模块

| 模块 | 功能 | admin | student |
|------|------|:-----:|:-------:|
| 登录认证 | JWT 登录 / Token 校验 / 退出 | ✅ | ✅ |
| 仪表盘 | 实验室/设备/预约/报修统计 + 趋势图 + 状态分布图 (ECharts) | ✅ | ✅ |
| 用户管理 | 用户 CRUD（列表/新增/编辑/删除） | ✅ | ❌ |
| 个人信息 | 查看个人信息 / 修改密码 | ✅ | ✅ |
| 实验室管理 | 实验室 CRUD + 状态管理（开放/维护/停用） | ✅ | 👁️ |
| 设备管理 | 设备 CRUD + 所属实验室关联 + 状态管理 | ✅ | 👁️ |
| 预约管理 | 提交预约 / 时间冲突检测 / 审批通过/驳回 / 完成/取消 | ✅ | ✅ |
| 报修管理 | 提交报修 / 确认/驳回/处理 + 设备状态联动 | ✅ | ✅ |
| 公告管理 | 发布/编辑/删除公告 + 类型分类 | ✅ | 👁️ |

> 👁️ = 只读浏览；❌ = 禁止访问（前后端双重校验）

## 权限模型

系统保留 `admin` 和 `student` 两种角色。

| 维度 | 实现方式 |
|------|----------|
| 后端 API | JWT 认证（`middleware/auth.ts`）+ Service 层 role 校验，`403 Forbidden` |
| 前端路由 | `AuthGuard` 登录守卫 / `AdminGuard` 角色守卫 |
| 前端菜单 | `BasicLayout` 根据 `user.role` 动态切换 admin/student 两套菜单 |
| 页面按钮 | 新增/编辑/删除等操作按钮仅 admin 可见 |

## 项目结构

```
lab-manager/
├── server/
│   ├── app/
│   │   ├── controller/
│   │   │   ├── user.ts              # 用户：登录/CRUD/自助修改
│   │   │   ├── lab.ts               # 实验室 CRUD
│   │   │   ├── device.ts            # 设备 CRUD
│   │   │   ├── reservation.ts       # 预约：申请/审批/取消
│   │   │   ├── repair.ts            # 报修：提交/确认/处理
│   │   │   ├── notice.ts            # 公告：发布/编辑/删除
│   │   │   └── dashboard.ts         # 仪表盘统计
│   │   ├── service/
│   │   │   ├── user.ts              # 用户业务逻辑 + 权限校验
│   │   │   ├── lab.ts               # 实验室业务逻辑
│   │   │   ├── device.ts            # 设备业务逻辑
│   │   │   ├── reservation.ts       # 预约审批 + 时间冲突检测
│   │   │   ├── repair.ts            # 报修处理 + 设备状态联动
│   │   │   ├── notice.ts            # 公告业务逻辑
│   │   │   └── dashboard.ts         # 统计数据聚合
│   │   ├── model/
│   │   │   ├── user.ts              # user 表
│   │   │   ├── lab.ts               # lab 表
│   │   │   ├── device.ts            # device 表
│   │   │   ├── reservation.ts       # reservation 表
│   │   │   ├── repair.ts            # repair 表
│   │   │   └── notice.ts            # notice 表
│   │   ├── middleware/auth.ts       # JWT 认证中间件
│   │   ├── extend/context.ts        # 统一响应格式 (code:0/1)
│   │   ├── database/init.ts         # 数据库初始化+种子数据
│   │   └── router.ts                # 路由表
│   ├── config/
│   │   ├── config.default.ts        # 数据库/JWT/CORS/中间件
│   │   └── plugin.ts                # 插件声明
│   ├── typings/                     # TypeScript 类型声明
│   ├── app.ts                       # sync({ alter: true })
│   ├── tsconfig.json
│   └── package.json
├── client/
│   ├── src/
│   │   ├── layouts/
│   │   │   └── BasicLayout.tsx      # 动态菜单 + 侧边栏
│   │   ├── pages/
│   │   │   ├── Login/               # 登录页
│   │   │   ├── Dashboard/           # 仪表盘 (ECharts)
│   │   │   ├── User/                # 用户管理 (admin)
│   │   │   ├── Profile/             # 个人信息 (所有用户)
│   │   │   ├── Lab/                 # 实验室管理
│   │   │   ├── Device/              # 设备管理
│   │   │   ├── Reservation/         # 预约管理
│   │   │   ├── Repair/              # 报修管理
│   │   │   └── Notice/              # 公告管理
│   │   ├── services/
│   │   │   ├── user.ts              # 用户 API
│   │   │   ├── lab.ts               # 实验室 API
│   │   │   ├── device.ts            # 设备 API
│   │   │   ├── reservation.ts       # 预约 API
│   │   │   ├── repair.ts            # 报修 API
│   │   │   ├── notice.ts            # 公告 API
│   │   │   └── dashboard.ts         # 统计 API
│   │   ├── utils/request.ts         # Axios 封装 (code:0/1 + 401/403)
│   │   ├── App.tsx                  # 路由 + AuthGuard + AdminGuard
│   │   ├── main.tsx                 # 入口
│   │   └── index.css                # 全局样式
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

### ER 关系

```
user ──1:N──→ reservation ←──N:1── lab
  │                                    │
  └──1:N──→ repair ←──────N:1─────────┘
                │
                └──1:1──→ device ←──N:1── lab

notice (独立表)
```

### 用户表 `user`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码（bcrypt 加密） |
| role | ENUM('admin','student') | 角色 |
| create_time | DATETIME | 创建时间 |

### 实验室表 `lab`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(100) | 实验室名称 |
| location | VARCHAR(200) | 实验室位置 |
| capacity | INT | 容纳人数，默认30 |
| status | ENUM('OPEN','MAINTAIN','DISABLED') | 开放状态 |
| description | VARCHAR(500) | 描述 |
| create_time | DATETIME | 创建时间 |

### 设备表 `device`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(100) | 设备名称 |
| model | VARCHAR(100) | 设备型号 |
| lab_id | INT | 所属实验室ID，外键 → lab.id |
| status | ENUM('NORMAL','BROKEN','MAINTAINING','DISABLED') | 设备状态 |
| description | VARCHAR(500) | 描述 |
| create_time | DATETIME | 创建时间 |

### 预约表 `reservation`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 预约人ID，外键 → user.id |
| lab_id | INT | 实验室ID，外键 → lab.id |
| date | DATE | 预约日期 |
| start_time | TIME | 开始时间 |
| end_time | TIME | 结束时间 |
| purpose | VARCHAR(500) | 预约用途 |
| status | ENUM('PENDING','APPROVED','REJECTED','FINISHED','CANCELLED') | 预约状态 |
| create_time | DATETIME | 创建时间 |

### 报修表 `repair`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 报修人ID，外键 → user.id |
| device_id | INT | 设备ID，外键 → device.id |
| lab_id | INT | 实验室ID，外键 → lab.id |
| fault_description | VARCHAR(500) | 故障描述 |
| status | ENUM('PENDING','CONFIRMED','REJECTED','RESOLVED') | 报修状态 |
| result | VARCHAR(500) | 处理结果 |
| create_time | DATETIME | 创建时间 |

### 公告表 `notice`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(200) | 标题 |
| content | VARCHAR(2000) | 内容 |
| type | ENUM('SYSTEM','EXPERIMENT','MAINTAIN','SUSPENSION') | 公告类型 |
| create_time | DATETIME | 发布时间 |

## 快速启动

### 1. 环境要求

- Node.js >= 16
- MySQL >= 8.0

### 2. 安装依赖

```bash
cd server && npm install
cd ../client && npm install
```

### 3. 初始化数据库

```bash
cd server
npx ts-node app/database/init.ts
```

此操作会：
- 创建 `lab_manager` 数据库
- 使用 Sequelize `sync({ force: true })` 自动建表
- 插入默认管理员、学生账号和示例数据（4个实验室、8台设备、3条公告）

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
| 学生 | student1 | 123456 | 浏览/预约/报修/个人信息 |

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

### 实验室管理 `/api/lab`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 实验室列表（分页/搜索/状态筛选） | 登录 |
| POST | /create | 创建实验室 | admin |
| PUT | /update/:id | 更新实验室 | admin |
| DELETE | /delete/:id | 删除实验室 | admin |

### 设备管理 `/api/device`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 设备列表（分页/搜索/状态/实验室筛选） | 登录 |
| POST | /create | 创建设备 | admin |
| PUT | /update/:id | 更新设备 | admin |
| DELETE | /delete/:id | 删除设备 | admin |

### 预约管理 `/api/reservation`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 预约列表（分页；student 仅看自己） | 登录 |
| POST | /create | 提交预约（含时间冲突检测） | 登录 |
| PUT | /approve/:id | 审批通过 | admin |
| PUT | /reject/:id | 驳回 | admin |
| PUT | /finish/:id | 完成预约 | admin |
| PUT | /cancel/:id | 取消预约 | 预约人 |

### 报修管理 `/api/repair`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 报修列表（分页；student 仅看自己） | 登录 |
| POST | /create | 提交报修 | 登录 |
| PUT | /confirm/:id | 确认报修 → device.status='BROKEN' | admin |
| PUT | /reject/:id | 驳回报修 | admin |
| PUT | /resolve/:id | 处理完成 → device.status='NORMAL' | admin |

### 公告管理 `/api/notice`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /list | 公告列表（分页） | 登录 |
| POST | /create | 发布公告 | admin |
| PUT | /update/:id | 编辑公告 | admin |
| DELETE | /delete/:id | 删除公告 | admin |

### 仪表盘 `/api/dashboard`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|:----:|
| GET | /stats | 实验室/设备/预约/报修统计 + 趋势 + 状态分布 | 登录 |

## 核心业务逻辑

### 预约时间冲突检测

提交预约时，后端自动检查同一实验室在同一日期是否有时间段重叠：

```
新预约 [start, end) 与已有预约 [r.start, r.end) 冲突条件：
start < r.end && end > r.start
```

仅检查状态为 `PENDING`（待审批）和 `APPROVED`（已通过）的预约。

### 报修状态联动

| 报修操作 | 设备状态变化 |
|----------|-------------|
| 确认报修 (CONFIRMED) | device.status → `BROKEN` |
| 处理完成 (RESOLVED) | device.status → `NORMAL` |
| 驳回报修 (REJECTED) | device.status 不变 |

## 建表方式

- 使用 Sequelize `sync({ alter: true })` 自动建表/更新表结构
- 不使用 migration，不手写 CREATE TABLE SQL
- 开发启动 (`npm run dev`) 自动同步

## 数据库重初始化

```bash
cd server && npx ts-node app/database/init.ts
```

> 此脚本使用 `sync({ force: true })` 清除旧表重建，仅用于首次部署或数据重置。
