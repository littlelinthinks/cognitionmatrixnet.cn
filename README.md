# 认知矩阵 · 文化属性研读（静态专栏站）

纯静态站点，零依赖、零构建。直接把本目录里的文件上传到 GitHub 仓库根目录即可。

## 文件说明
- `index.html` — 页面骨架（头部/底部/容器）
- `assets/style.css` — 全部样式（禅意科技配色：暖墨黑底 + 暗金主色 + 朱砂点睛 + 黛青微光）
- `assets/app.js` — 内容数据 + 页面切换逻辑（**要改文字就改这里**）
- `assets/logo.png` / `assets/favicon.ico` — 矩阵立方 logo 与标签页图标
- `vercel.json` — 告诉 Vercel 当静态站部署、免构建

## 怎么改成你自己的内容
打开 `assets/app.js`，顶部有个 `DATA` 对象：
- `articles`：文章列表（标题、标签、日期、摘要、正文）。正文用 HTML 写，支持 `<h2>` `<p>` `<blockquote>` `<ul><li>`。
- `concepts`：四个概念卡片。
- `quotes`：语录。

改完保存，上传，Vercel 自动更新。

## 部署注意
你之前的仓库是 React 工程。换成这个静态站后：
- 推荐做法：把仓库根目录**旧文件删掉**（`package.json`、`src/`、`public/`、配置文件等），再上传本目录文件。
- 或不删旧文件，仅在 Vercel 项目设置里把 **Framework Preset 设为 Other**、**Build Command 清空**；本目录的 `vercel.json` 也会强制静态部署。
- 上传后约 1 分钟生效，浏览器 **Ctrl+F5** 强刷。
- 域名 `cognitionmatrixnet.cn` 已指向本站（DNS 在阿里云），无需再改。
