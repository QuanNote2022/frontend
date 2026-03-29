# 矿物识别系统开发文档

## 1. 项目概述

### 1.1 项目背景

随着人工智能技术的快速发展，计算机视觉在各个领域的应用越来越广泛。矿物识别作为地质科学中的重要环节，传统上依赖于专业人员的经验和专业设备，效率较低且成本较高。为了提高矿物识别的效率和准确性，我们开发了这款智能矿物识别与科普问答系统。

### 1.2 项目目标

- 提供便捷的矿物识别功能，通过图像上传或相机拍摄即可快速识别矿物种类
- 提供专业的矿物科普知识，通过智能问答系统解答用户关于矿物的疑问
- 建立个人历史记录系统，方便用户查看和管理过去的识别和问答记录
- 提供数据可视化功能，展示矿物识别的统计信息和趋势
- 构建用户友好的界面，确保系统易于使用

### 1.3 主要功能

- **矿物识别**：支持图片上传和相机拍摄两种方式，自动识别矿物种类并提供详细信息
- **科普问答**：智能问答系统，解答用户关于矿物的各种问题
- **历史记录**：记录用户的识别历史和问答历史，支持查看和管理
- **数据统计**：展示矿物识别的统计数据，包括识别频率和矿物类型分布
- **用户管理**：支持用户注册、登录和个人信息管理

## 2. 技术栈和依赖

### 2.1 核心框架

| 技术/框架 | 版本 | 用途 |
|---------|------|------|
| Vue 3 | ^3.5.30 | 前端框架，用于构建用户界面 |
| TypeScript | ~5.9.3 | 类型安全的JavaScript超集 |
| Pinia | ^3.0.4 | 状态管理库，替代Vuex |
| Vue Router | ^4.6.4 | 路由管理，处理页面导航 |
| Element Plus | ^2.13.6 | UI组件库，提供丰富的前端组件 |

### 2.2 工具库

| 库名称 | 版本 | 用途 |
|--------|------|------|
| Axios | ^1.14.0 | HTTP客户端，用于与后端API交互 |
| ECharts | ^6.0.0 | 数据可视化库，用于绘制图表 |
| Vue ECharts | ^8.0.1 | ECharts的Vue组件封装 |
| Markdown It | ^14.1.1 | Markdown解析器，用于渲染科普问答内容 |
| Highlight.js | ^11.11.1 | 代码高亮库，用于Markdown中的代码块 |
| Sass | ^1.98.0 | CSS预处理器，用于编写样式 |

### 2.3 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| Vite | ^8.0.1 | 构建工具，用于开发和生产构建 |
| Vue TSC | ^3.2.5 | TypeScript类型检查工具 |
| Mock.js | ^1.1.0 | 模拟数据生成工具，用于开发环境 |
| Unplugin Auto Import | ^21.0.0 | 自动导入Vue组合式API |
| Unplugin Vue Components | ^32.0.0 | 自动导入Vue组件 |

### 2.4 环境配置

- **开发环境**：`.env.development` 文件配置开发环境变量
- **生产环境**：`.env.production` 文件配置生产环境变量

## 3. 项目目录结构

### 3.1 整体结构

```
frontend/
├── mock/             # 模拟数据，用于开发环境
├── public/           # 静态资源文件
├── src/              # 源代码
│   ├── api/          # API 接口调用
│   ├── assets/       # 静态资源
│   ├── components/   # 组件
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia 状态管理
│   ├── types/        # TypeScript 类型定义
│   ├── utils/        # 工具函数
│   ├── views/        # 页面视图
│   ├── App.vue       # 根组件
│   ├── auto-imports.d.ts  # 自动导入配置
│   ├── components.d.ts    # 组件类型声明
│   └── main.ts       # 应用入口
├── .env.development  # 开发环境配置
├── .env.production   # 生产环境配置
├── .gitignore        # Git 忽略文件
├── README.md         # 项目说明
├── index.html        # HTML 模板
├── package.json      # 项目配置和依赖
├── tsconfig.app.json # TypeScript 配置
├── tsconfig.json     # TypeScript 配置
├── tsconfig.node.json # TypeScript 配置
└── vite.config.ts    # Vite 配置
```

### 3.2 核心目录说明

#### 3.2.1 src/api/

存放 API 接口调用相关文件，用于与后端服务交互。

- **index.ts**：Axios 实例配置，包含请求和响应拦截器
- **chat.ts**：科普问答相关 API
- **history.ts**：历史记录相关 API
- **mineral.ts**：矿物识别相关 API
- **user.ts**：用户管理相关 API

#### 3.2.2 src/assets/

存放静态资源文件。

- **styles/**：全局样式文件
  - **global.scss**：全局样式
  - **variables.scss**：样式变量
- **hero.png**：首页英雄图
- **vite.svg**：Vite 标志
- **vue.svg**：Vue 标志

#### 3.2.3 src/components/

存放 Vue 组件。

- **common/**：通用组件
  - **CameraCapture.vue**：相机拍摄组件
  - **ChatMessage.vue**：聊天消息组件
  - **DetectionCanvas.vue**：识别结果画布组件
  - **ImageUploader.vue**：图片上传组件
  - **MarkdownRenderer.vue**：Markdown 渲染组件
  - **MineralCard.vue**：矿物卡片组件
  - **StatChart.vue**：统计图表组件
- **layout/**：布局组件
  - **AppHeader.vue**：应用头部
  - **AppSidebar.vue**：应用侧边栏
  - **MainLayout.vue**：主布局

#### 3.2.4 src/router/

存放路由配置文件。

- **index.ts**：路由定义和导航守卫

#### 3.2.5 src/stores/

存放 Pinia 状态管理文件。

- **chat.ts**：聊天相关状态
- **history.ts**：历史记录相关状态
- **mineral.ts**：矿物识别相关状态
- **user.ts**：用户相关状态

#### 3.2.6 src/types/

存放 TypeScript 类型定义文件。

- **api.d.ts**：API 相关类型
- **chat.d.ts**：聊天相关类型
- **mineral.d.ts**：矿物相关类型
- **user.d.ts**：用户相关类型

#### 3.2.7 src/utils/

存放工具函数。

- **format.ts**：格式化函数
- **storage.ts**：本地存储操作函数

#### 3.2.8 src/views/

存放页面视图组件。

- **auth/**：认证相关页面
  - **LoginView.vue**：登录页面
  - **RegisterView.vue**：注册页面
- **chat/**：聊天相关页面
  - **ChatView.vue**：聊天页面
- **history/**：历史记录相关页面
  - **ChatHistoryView.vue**：聊天历史页面
  - **DetectHistoryView.vue**：识别历史页面
- **home/**：首页
  - **HomeView.vue**：首页视图
- **mineral/**：矿物相关页面
  - **MineralDetailView.vue**：矿物详情页面
  - **MineralDetectView.vue**：矿物识别页面
- **profile/**：个人中心
  - **ProfileView.vue**：个人信息页面

## 4. 核心功能模块分析

### 4.1 矿物识别模块

矿物识别是系统的核心功能之一，允许用户通过上传图片或使用相机拍摄来识别矿物种类。

#### 4.1.1 功能流程

1. **图片获取**：用户可以选择上传本地图片或使用相机拍摄
2. **图片预处理**：对图片进行压缩和格式转换
3. **发送识别请求**：将图片发送到后端进行识别
4. **接收识别结果**：后端返回识别结果，包括矿物名称、置信度等
5. **展示识别结果**：在页面上展示识别结果，包括矿物信息和图片
6. **保存识别历史**：将识别记录保存到历史记录中

#### 4.1.2 关键组件

- **ImageUploader.vue**：图片上传组件，支持本地文件上传
- **CameraCapture.vue**：相机拍摄组件，支持实时拍摄
- **DetectionCanvas.vue**：识别结果画布组件，用于展示识别结果
- **MineralCard.vue**：矿物卡片组件，用于展示矿物信息

#### 4.1.3 相关页面

- **MineralDetectView.vue**：矿物识别页面，集成了图片上传和相机拍摄功能
- **MineralDetailView.vue**：矿物详情页面，展示详细的矿物信息

### 4.2 科普问答模块

科普问答模块允许用户与智能系统进行对话，获取关于矿物的科普知识。

#### 4.2.1 功能流程

1. **用户提问**：用户在聊天界面输入问题
2. **发送问题**：将问题发送到后端
3. **接收回答**：后端返回智能回答
4. **展示对话**：在聊天界面展示对话历史
5. **保存对话历史**：将对话记录保存到历史记录中

#### 4.2.2 关键组件

- **ChatMessage.vue**：聊天消息组件，用于展示消息内容
- **MarkdownRenderer.vue**：Markdown渲染组件，用于渲染富文本回答

#### 4.2.3 相关页面

- **ChatView.vue**：聊天页面，集成了消息输入和展示功能

### 4.3 历史记录模块

历史记录模块允许用户查看和管理过去的识别和问答记录。

#### 4.3.1 功能流程

1. **获取历史记录**：从后端获取用户的历史记录
2. **展示历史记录**：在页面上展示历史记录列表
3. **查看详情**：点击记录查看详细信息
4. **管理记录**：支持删除记录等操作

#### 4.3.2 相关页面

- **DetectHistoryView.vue**：识别历史页面，展示矿物识别历史
- **ChatHistoryView.vue**：聊天历史页面，展示科普问答历史

### 4.4 数据统计模块

数据统计模块展示矿物识别的统计信息和趋势，帮助用户了解识别情况。

#### 4.4.1 功能流程

1. **获取统计数据**：从后端获取统计数据
2. **数据可视化**：使用ECharts将数据可视化
3. **展示统计图表**：在页面上展示统计图表

#### 4.4.1 关键组件

- **StatChart.vue**：统计图表组件，用于展示各种统计图表

#### 4.4.2 相关页面

- **HomeView.vue**：首页，展示系统概览和统计数据

### 4.5 用户管理模块

用户管理模块负责用户的注册、登录和个人信息管理。

#### 4.5.1 功能流程

1. **用户注册**：新用户注册账号
2. **用户登录**：用户登录系统
3. **个人信息管理**：用户查看和修改个人信息
4. **退出登录**：用户退出系统

#### 4.5.2 相关页面

- **LoginView.vue**：登录页面
- **RegisterView.vue**：注册页面
- **ProfileView.vue**：个人中心页面

## 5. 开发环境搭建指南

### 5.1 环境要求

- **Node.js**：版本 18.0.0 或更高
- **npm**：版本 9.0.0 或更高
- **Git**：版本 2.0.0 或更高

### 5.2 安装依赖

1. **克隆项目**

```bash
git clone <项目仓库地址>
cd frontend
```

2. **安装依赖**

```bash
npm install
```

### 5.3 运行项目

1. **开发模式**

```bash
npm run dev
```

运行后，系统会在本地启动一个开发服务器，默认地址为 `http://localhost:5173`。

2. **构建生产版本**

```bash
npm run build
```

构建完成后，生产版本的文件会生成在 `dist` 目录中。

3. **预览生产版本**

```bash
npm run preview
```

### 5.4 环境配置

项目使用 `.env` 文件来配置环境变量：

- **.env.development**：开发环境配置
- **.env.production**：生产环境配置

主要配置项：

- `VITE_API_BASE_URL`：API 基础 URL
- `VITE_APP_TITLE`：应用标题

## 6. API 接口文档

### 6.1 基础配置

- **API 基础 URL**：通过环境变量 `VITE_API_BASE_URL` 配置
- **请求头**：默认添加 `Authorization: Bearer <token>` 用于身份验证
- **响应格式**：统一采用 JSON 格式，包含 `code`、`message` 和 `data` 字段

### 6.2 认证相关 API

| 接口 | 方法 | 路径 | 描述 | 请求体 | 响应数据 |
|------|------|------|------|--------|----------|
| 登录 | POST | `/auth/login` | 用户登录 | `{ username: string, password: string }` | `{ token: string, user: UserInfo }` |
| 注册 | POST | `/auth/register` | 用户注册 | `{ username: string, password: string, email: string }` | `{ token: string, user: UserInfo }` |
| 获取用户信息 | GET | `/auth/me` | 获取当前用户信息 | N/A | `UserInfo` |
| 更新用户信息 | PUT | `/auth/me` | 更新用户信息 | `{ username: string, email: string }` | `UserInfo` |
| 退出登录 | POST | `/auth/logout` | 用户退出登录 | N/A | `null` |

### 6.3 矿物识别相关 API

| 接口 | 方法 | 路径 | 描述 | 请求体 | 响应数据 |
|------|------|------|------|--------|----------|
| 矿物识别 | POST | `/mineral/detect` | 上传图片识别矿物 | `FormData { image: File }` | `DetectionRecord` |
| 获取识别详情 | GET | `/mineral/detect/:id` | 获取矿物识别详情 | N/A | `DetectionRecord` |
| 获取矿物分类 | GET | `/mineral/categories` | 获取矿物分类列表 | N/A | `MineralCategory[]` |
| 获取矿物信息 | GET | `/mineral/info/:name` | 获取矿物详细信息 | N/A | `MineralInfo` |

### 6.4 科普问答相关 API

| 接口 | 方法 | 路径 | 描述 | 请求体 | 响应数据 |
|------|------|------|------|--------|----------|
| 创建聊天会话 | POST | `/chat/session` | 创建新的聊天会话 | `{ detectId?: string, mineralName?: string }` | `ChatSession` |
| 获取会话列表 | GET | `/chat/sessions` | 获取聊天会话列表 | N/A | `PageResult<ChatSession>` |
| 获取会话消息 | GET | `/chat/session/:sessionId/messages` | 获取会话的消息记录 | N/A | `ChatMessage[]` |
| 删除会话 | DELETE | `/chat/session/:sessionId` | 删除聊天会话 | N/A | `null` |
| 发送消息 | POST | `/chat/session/:sessionId/send` | 发送聊天消息 | `{ content: string }` | `ChatMessage` |

### 6.5 历史记录相关 API

| 接口 | 方法 | 路径 | 描述 | 请求体 | 响应数据 |
|------|------|------|------|--------|----------|
| 获取识别历史 | GET | `/history/detect` | 获取矿物识别历史 | N/A | `PageResult<DetectionRecord>` |
| 获取聊天历史 | GET | `/history/chat` | 获取聊天历史 | N/A | `PageResult<ChatSession>` |
| 删除识别记录 | DELETE | `/history/detect/:id` | 删除识别记录 | N/A | `null` |
| 删除聊天记录 | DELETE | `/history/chat/:id` | 删除聊天记录 | N/A | `null` |
| 获取统计数据 | GET | `/history/stats` | 获取用户统计数据 | N/A | `Stats` |
| 获取矿物频率 | GET | `/history/mineral-frequency` | 获取矿物识别频率 | N/A | `MineralFrequency[]` |

### 6.6 接口调用示例

```typescript
// 示例：调用矿物识别接口
import { detectMineralApi } from '@/api/mineral'

async function uploadImage(file: File) {
  try {
    const response = await detectMineralApi(file, (percent) => {
      console.log(`上传进度：${percent}%`)
    })
    console.log('识别结果：', response.data)
  } catch (error) {
    console.error('识别失败：', error)
  }
}

// 示例：调用登录接口
import { loginApi } from '@/api/user'

async function login(username: string, password: string) {
  try {
    const response = await loginApi({ username, password })
    console.log('登录成功：', response.data)
  } catch (error) {
    console.error('登录失败：', error)
  }
}
```

## 7. 代码规范和最佳实践

### 7.1 代码风格规范

- **缩进**：使用 2 个空格进行缩进
- **分号**：每行代码结束时使用分号
- **引号**：使用单引号（'），字符串模板使用反引号（`）
- **大括号**：左大括号与语句同一行，右大括号单独一行
- **空行**：函数之间、代码块之间使用空行分隔
- **注释**：复杂逻辑添加注释，组件和函数添加 JSDoc 注释

### 7.2 命名规范

- **变量**：使用驼峰命名法（camelCase）
- **常量**：使用全大写字母和下划线（UPPERCASE_WITH_UNDERSCORES）
- **函数**：使用驼峰命名法（camelCase），动词开头
- **类**：使用帕斯卡命名法（PascalCase）
- **组件**：使用帕斯卡命名法（PascalCase）
- **文件**：使用帕斯卡命名法（PascalCase）或小写字母加连字符（kebab-case）
- **目录**：使用小写字母加连字符（kebab-case）

### 7.3 组件开发规范

- **组件拆分**：将复杂组件拆分为多个小组件，提高可维护性
- **Props 定义**：明确定义 Props 的类型和默认值
- **事件传递**：使用 `defineEmits` 定义组件事件
- **样式隔离**：使用 `scoped` 或 CSS Modules 隔离组件样式
- **生命周期**：合理使用生命周期钩子，避免在 `created` 或 `mounted` 中执行耗时操作

### 7.4 状态管理规范

- **状态组织**：按功能模块组织状态，避免全局状态污染
- **状态命名**：使用清晰、语义化的状态名称
- **异步操作**：在 Pinia store 中处理异步操作，使用 `async/await`
- **状态持久化**：使用 `localStorage` 或 `sessionStorage` 持久化必要的状态

### 7.5 API 调用规范

- **API 封装**：将 API 调用封装在 `api` 目录中，统一管理
- **错误处理**：使用 try/catch 捕获 API 调用错误
- **请求拦截**：在请求拦截器中添加认证信息
- **响应拦截**：在响应拦截器中统一处理错误和状态码
- **上传处理**：使用专门的上传请求函数处理文件上传

### 7.6 错误处理规范

- **全局错误处理**：使用 Element Plus 的 `ElMessage` 组件显示错误信息
- **局部错误处理**：在组件中处理特定的错误情况
- **网络错误**：统一处理网络请求错误
- **表单验证**：使用 Element Plus 的表单验证功能

### 7.7 性能优化建议

- **组件懒加载**：使用 `import()` 动态导入组件
- **图片优化**：使用适当的图片格式和尺寸，考虑使用图片懒加载
- **状态管理优化**：避免不必要的状态更新和计算
- **API 优化**：使用缓存减少重复请求，合理使用分页
- **渲染优化**：使用 `v-if` 和 `v-show` 合理控制渲染，避免不必要的 DOM 操作

### 7.8 TypeScript 使用规范

- **类型定义**：为所有变量、函数和组件 Props 添加类型定义
- **接口设计**：使用接口（interface）定义复杂类型
- **类型推断**：利用 TypeScript 的类型推断，减少冗余类型定义
- **类型断言**：仅在必要时使用类型断言，避免滥用

## 8. 部署指南

### 8.1 构建生产版本

在部署前，需要先构建生产版本：

```bash
npm run build
```

构建完成后，生产版本的文件会生成在 `dist` 目录中。

### 8.2 部署到静态网站托管服务

#### 8.2.1 部署到 Netlify

1. **登录 Netlify**：访问 [Netlify](https://www.netlify.com/) 并登录
2. **创建新站点**：点击 "Add new site" → "Import an existing project"
3. **连接仓库**：选择你的代码仓库
4. **配置构建设置**：
   - **Build command**：`npm run build`
   - **Publish directory**：`dist`
5. **部署**：点击 "Deploy site" 开始部署

#### 8.2.2 部署到 Vercel

1. **登录 Vercel**：访问 [Vercel](https://vercel.com/) 并登录
2. **创建新项目**：点击 "New Project"
3. **导入仓库**：选择你的代码仓库
4. **配置项目**：
   - **Framework Preset**：选择 "Vue"
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
5. **部署**：点击 "Deploy" 开始部署

#### 8.2.3 部署到 GitHub Pages

1. **安装 gh-pages 包**：
   ```bash
   npm install -D gh-pages
   ```

2. **在 package.json 中添加脚本**：
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **构建并部署**：
   ```bash
   npm run build
   npm run deploy
   ```

### 8.3 部署到服务器

1. **准备服务器**：确保服务器已安装 Node.js 和 Nginx
2. **上传构建文件**：将 `dist` 目录中的文件上传到服务器
3. **配置 Nginx**：
   ```nginx
   server {
     listen 80;
     server_name example.com;
     
     location / {
       root /path/to/dist;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. **重启 Nginx**：
   ```bash
   sudo systemctl restart nginx
   ```

### 8.4 环境变量配置

部署时，需要根据环境配置对应的 `.env.production` 文件：

```
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=矿物识别系统
```

### 8.5 部署注意事项

- **API 地址**：确保 `VITE_API_BASE_URL` 配置正确，指向实际的后端 API 地址
- **CORS 配置**：确保后端 API 已配置 CORS，允许前端域名访问
- **HTTPS**：生产环境建议使用 HTTPS 协议
- **缓存策略**：合理配置静态资源缓存策略
- **错误监控**：考虑添加错误监控服务，如 Sentry

## 9. 常见问题和解决方案

### 9.1 开发环境问题

#### 9.1.1 依赖安装失败

**问题**：执行 `npm install` 时失败

**解决方案**：
- 确保 Node.js 版本符合要求（18.0.0 或更高）
- 尝试使用 `npm install --force` 强制安装
- 清理 npm 缓存：`npm cache clean --force`
- 检查网络连接，确保能访问 npm 仓库

#### 9.1.2 开发服务器启动失败

**问题**：执行 `npm run dev` 时启动失败

**解决方案**：
- 检查端口是否被占用，尝试修改 `vite.config.ts` 中的端口配置
- 检查环境变量配置是否正确
- 查看终端错误信息，根据具体错误进行修复

### 9.2 构建问题

#### 9.2.1 构建失败

**问题**：执行 `npm run build` 时失败

**解决方案**：
- 检查 TypeScript 类型错误，运行 `npm run build` 会自动执行类型检查
- 检查依赖版本是否兼容
- 查看终端错误信息，根据具体错误进行修复

#### 9.2.2 构建后资源路径错误

**问题**：构建后部署到服务器，资源路径错误

**解决方案**：
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保静态资源引用路径正确
- 检查 Nginx 配置，确保正确处理静态资源

### 9.3 运行时问题

#### 9.3.1 API 调用失败

**问题**：前端无法正常调用后端 API

**解决方案**：
- 检查 `VITE_API_BASE_URL` 配置是否正确
- 检查后端 API 是否正常运行
- 检查 CORS 配置是否正确
- 查看浏览器控制台网络请求，分析错误原因

#### 9.3.2 图片上传失败

**问题**：矿物识别时图片上传失败

**解决方案**：
- 检查文件大小是否超过限制
- 检查网络连接是否稳定
- 检查后端 API 是否支持文件上传
- 查看浏览器控制台错误信息

#### 9.3.3 页面路由错误

**问题**：页面路由跳转失败

**解决方案**：
- 检查路由配置是否正确
- 检查路由守卫逻辑
- 确保使用 `router.push()` 正确跳转
- 查看浏览器控制台错误信息

### 9.4 性能问题

#### 9.4.1 页面加载缓慢

**问题**：页面加载时间过长

**解决方案**：
- 使用组件懒加载
- 优化图片大小和格式
- 减少不必要的 API 请求
- 使用浏览器缓存

#### 9.4.2 渲染性能问题

**问题**：页面渲染卡顿

**解决方案**：
- 减少 DOM 操作
- 使用 `v-if` 和 `v-show` 合理控制渲染
- 优化计算属性和监听器
- 避免在模板中执行复杂计算

### 9.5 其他问题

#### 9.5.1 浏览器兼容性问题

**问题**：在某些浏览器中功能异常

**解决方案**：
- 使用 Babel 转译 JavaScript
- 添加浏览器前缀
- 测试主流浏览器兼容性
- 使用 Polyfill 兼容旧浏览器

#### 9.5.2 移动端适配问题

**问题**：在移动设备上显示异常

**解决方案**：
- 使用响应式布局
- 配置媒体查询
- 测试不同屏幕尺寸
- 优化触摸交互