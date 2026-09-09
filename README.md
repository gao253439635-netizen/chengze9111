# 高祥 · AI设计魔法师

个人作品集 + 接单后台管理系统。前台展示作品与服务，后台管理所有文案、图片与配色。

## 技术栈

- **前端**: React 19 + Vite 6 + Tailwind v4
- **后端**: Express + Node 24 内置 SQLite（`node:sqlite`，无需额外依赖）
- **部署**: Railway / Render（单进程全栈应用）

## 本地开发

```bash
npm install
cp .env.example .env   # 按需修改 ADMIN_PASSWORD
npm run dev:all        # 前台 :9111  |  后台 API :9112
```

访问：
- 前台：http://localhost:9111
- 后台：http://localhost:9111/admin

## 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `ADMIN_PASSWORD` | 后台登录密码 | —（必须设置） |
| `AUTH_ENABLED` | 是否启用后台认证 | `false` |
| `DB_PATH` | SQLite 数据库路径 | `./data/app.db` |
| `CORS_ORIGINS` | 部署时填真实域名 | `*` |

完整配置见 `.env.example`。

## 构建 & 生产

```bash
npm run build   # 编译前端到 dist/
npm start       # 启动全栈服务（端口 9111）
```

## 数据库

使用 Node.js 内置 `node:sqlite`（无需额外依赖），数据持久化在 `data/app.db`。
部署平台首次启动时会自动建表，无需手动迁移。

## 后台功能

- 导航区域：品牌名、头衔、导航菜单文字与顺序
- 首屏文案：大标题、按钮文字、视频互动参数
- 接单类目：图片、链接、说明、排列顺序
- 作品图：上传/外链、图注、排序、删除
- 关于我：简介、学历、工作经历（含排序）
- 页脚：站点地图、联系方式、社交链接
- 配色：主题色（ink/accent/dot）实时预览
- 接单线索：状态管理（新/已联系/成交/流失/重复）
