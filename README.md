# 高校实验资源协同管理平台

基于前后端分离架构的高校实验资源协同管理平台设计与实现（毕业设计项目）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Ant Design 5 + ProComponents + React Router 6 + Axios + Vite |
| 后端 | Egg.js 3 + Sequelize 6 + JWT + bcryptjs |
| 数据库 | MySQL 8 |

## 功能模块

1. **仪表盘** - 系统数据总览（实验室/设备/课程/用户/预约统计）
2. **用户管理** - 用户 CRUD，支持管理员/教师/学生三种角色
3. **实验室管理** - 实验室信息管理（名称/位置/容纳人数/状态）
4. **设备管理** - 设备信息管理，关联所属实验室
5. **课程管理** - 实验课程管理，关联教师和实验室
6. **预约管理** - 实验预约/审批流程（学生预约 → 教师/管理员审批）

## 项目结构

```
lab-manager/
├── server/                          # 后端 Egg.js
│   ├── app/
│   │   ├── controller/             # 控制器层
│   │   │   ├── user.js             # 用户模块
│   │   │   ├── laboratory.js       # 实验室模块
│   │   │   ├── device.js           # 设备模块
│   │   │   ├── course.js           # 课程模块
│   │   │   ├── reservation.js      # 预约模块
│   │   │   └── dashboard.js        # 仪表盘
│   │   ├── service/                # 业务逻辑层
│   │   ├── model/                  # Sequelize 数据模型
│   │   ├── middleware/auth.js      # JWT 认证中间件
│   │   ├── extend/context.js       # 响应扩展方法
│   │   ├── database/init.js        # 数据库初始化脚本
│   │   └── router.js               # 路由配置
│   ├── config/
│   │   ├── config.default.js       # 主配置（数据库/JWT/CORS）
│   │   └── plugin.js               # 插件配置
│   ├── app.js                      # 应用启动入口
│   └── package.json
├── client/                          # 前端 React
│   ├── src/
│   │   ├── layouts/BasicLayout.jsx # 主布局（侧边栏+顶栏）
│   │   ├── pages/
│   │   │   ├── Login/              # 登录页
│   │   │   ├── Dashboard/          # 仪表盘
│   │   │   ├── User/               # 用户管理
│   │   │   ├── Laboratory/         # 实验室管理
│   │   │   ├── Device/             # 设备管理
│   │   │   ├── Course/             # 课程管理
│   │   │   └── Reservation/        # 预约管理
│   │   ├── utils/request.js        # Axios 封装
│   │   ├── App.jsx                 # 路由配置
│   │   └── main.jsx                # 入口文件
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 快速启动

### 1. 环境要求

- Node.js >= 16
- MySQL >= 8.0

### 2. 初始化数据库

```bash
# 确保 MySQL 已启动，然后执行：
cd server
node app/database/init.js
```

此操作会：
- 创建 `lab_manager` 数据库
- 创建所有数据表
- 插入默认管理员账号和示例数据

### 3. 启动后端

```bash
cd server
npm install
npm run dev
```

后端运行在 `http://127.0.0.1:7001`

### 4. 启动前端

```bash
cd client
npm install
npm run dev
```

前端运行在 `http://localhost:3000`

### 5. 默认账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |

## API 接口一览

### 用户模块 `/api/user`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /register | 用户注册 | 否 |
| POST | /login | 用户登录 | 否 |
| GET | /info | 当前用户信息 | 是 |
| GET | /list | 用户列表（分页） | 是 |
| POST | /create | 创建用户 | 是 |
| PUT | /update/:id | 更新用户 | 是 |
| DELETE | /delete/:id | 删除用户 | 是 |
| GET | /detail/:id | 用户详情 | 是 |

### 实验室模块 `/api/lab`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 列表（分页/搜索） |
| GET | /all-open | 所有开放实验室 |
| POST | /create | 创建 |
| PUT | /update/:id | 更新 |
| DELETE | /delete/:id | 删除 |
| GET | /detail/:id | 详情 |

### 设备模块 `/api/device`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 列表（分页/搜索） |
| POST | /create | 创建 |
| PUT | /update/:id | 更新 |
| DELETE | /delete/:id | 删除 |
| GET | /detail/:id | 详情 |

### 课程模块 `/api/course`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 列表（分页/搜索） |
| POST | /create | 创建 |
| PUT | /update/:id | 更新 |
| DELETE | /delete/:id | 删除 |
| GET | /detail/:id | 详情 |

### 预约模块 `/api/reservation`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 列表（分页） |
| POST | /create | 创建预约 |
| PUT | /approve/:id | 审批预约 |
| PUT | /cancel/:id | 取消预约 |
| GET | /detail/:id | 详情 |

### 仪表盘 `/api/dashboard`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /stats | 统计数据 |

## 数据库表设计

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| user | 用户表 | username, password, name, role, phone, email, status |
| laboratory | 实验室表 | name, location, capacity, description, equipment_count, status |
| device | 设备表 | name, type, model, lab_id, status, description |
| course | 课程表 | name, teacher_id, lab_id, semester, schedule, max_students, status |
| reservation | 预约表 | user_id, lab_id, course_id, title, date, start_time, end_time, status |
