# MATRIX NET · 矩阵网络

这是从万小智 AI 建站预览环境完整抓取并重建的 React + Vite 单页应用（SPA）。

## 项目结构

```
cognitionmatrixnet.cn/
├── dist/                  # 构建产物，可直接部署
├── src/                   # 完整源码（9 个页面 + 12 个组件）
│   ├── index.css          # 已编译的 Tailwind 样式（119KB，包含全部主题色/动效）
│   ├── main.tsx           # 应用入口
│   ├── routes.tsx         # 路由定义
│   ├── layout.tsx         # 全局布局
│   └── pages/             # 首页、工具库、商业大脑、情报、评测、企业、Agent、VIP、支付结果
├── public/favicon.ico     # 站点图标
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env                   # 环境变量占位符
```

## 本地开发

```bash
pnpm install
pnpm dev        # 默认 http://localhost:5173
pnpm build      # 输出到 dist/
pnpm preview   # 本地预览 dist
```

## 部署到 `cognitionmatrixnet.cn`

本项目为 React Router **BrowserRouter** SPA，部署时需要配置**所有路由回退到 `index.html`**。

### 方案一：阿里云 OSS 静态网站托管（推荐，成本最低）

1. 在阿里云 OSS 创建 Bucket（例如 `cognitionmatrixnet-web`），地域选择靠近用户的区域。
2. 上传 `dist/` 目录下所有文件到 Bucket 根目录。
3. 开启 Bucket 的「静态网站」：
   - 默认首页：`index.html`
   - 默认 404 页：`index.html`（关键，否则刷新子页面会 404）
4. 在 Bucket「传输加速 / 自定义域名」里绑定 `cognitionmatrixnet.cn`。
5. 域名添加 CNAME 记录指向 OSS 自定义域名。
6. **备案**：`.cn` 域名 + 国内 OSS 必须完成 ICP 备案。

### 方案二：阿里云 ECS / 轻量服务器 + Nginx

将 `dist/` 放到服务器 `/var/www/cognitionmatrixnet.cn/`，Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name cognitionmatrixnet.cn www.cognitionmatrixnet.cn;
    root /var/www/cognitionmatrixnet.cn/dist;
    index index.html;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|webp|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 方案三：Cloudflare Pages / Vercel / Netlify

直接拖拽 `dist/` 目录上传，平台会自动处理 SPA fallback。

## 环境变量

支付、订单相关功能依赖：

- `VITE_SUPABASE_URL`：Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`：Supabase 匿名 key

如需支付功能，替换 `.env` 中的占位符后重新 `pnpm build`。

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/tools` | AI 工具矩阵 |
| `/business-brain` | AI 商业大脑 |
| `/insights` | 行业情报 |
| `/assessment` | 个人诊断 |
| `/enterprise` | 企业方案 |
| `/agent` | AI Agent |
| `/vip` | 会员中心 |
| `/payment-result` | 支付结果 |

## 说明

- 样式来自抓取的原站 Tailwind v4 编译产物，颜色主题（霓虹蓝 `#00E5FF`、霓虹绿 `#39FF14`、金色 `#D4AF37`、深黑 `#0A0B0D`）完整保留。
- 图片资源目前仍指向阿里万网 BaaS 外链；如需完全本地化，需将这些图片下载后替换源码中的 URL。
- 抓取时间为 2026-09-03，共 34 个源文件全部还原。
