# MATRIX NET 上线部署指南

> 目标：把重建后的站点部署到 `cognitionmatrixnet.cn`，让访客能正常打开。
> 项目目录：`/workspace/cognitionmatrixnet.cn/`
> 构建产物：`/workspace/cognitionmatrixnet.cn/dist/`
> 产物压缩包：`/workspace/cognitionmatrixnet.cn/dist.zip`（236 KB）

---

## 一、先做一个关键选择：是否备案

| 你的情况 | 推荐方案 | 时间 | 费用 |
|---|---|---|---|
| **想立刻上线，先跑起来** | Vercel / Cloudflare Pages（海外节点） | 5-10 分钟 | 免费 |
| **长期运营，面向国内用户** | 阿里云 OSS 静态网站托管 + ICP 备案 | 1-3 周（主要在备案审核） | 极低（OSS 按量） |
| **以后还要加后端/数据库** | 阿里云 ECS + Nginx | 更复杂 | 服务器月费 |

**关于备案**：
- `cognitionmatrixnet.cn` 是 `.cn` 域名，如果解析到**国内服务器或 OSS 国内节点**，必须完成 **ICP 备案**。
- 如果解析到 Vercel、Cloudflare Pages 等**海外托管**，目前不需要备案。
- 阿里云有备案服务，提交后一般 1-3 周通过。期间域名可以正常访问海外节点。

---

## 二、方案 A：免备案，5 分钟上线（推荐先试）

### 推荐：Vercel

1. 打开 [vercel.com](https://vercel.com)，用 GitHub/GitLab 账号登录。
2. 新建项目 → **无需上传 Git**，点击项目面板里的 **"Add New... → Project"**，再选 **"Deploy from a directory"**（或 Vercel CLI 直接传目录）。
3. 上传本目录下的 `dist/` 文件夹。
4. 部署完成后，Vercel 会给你一个 `*.vercel.app` 的临时域名。
5. 进入项目 **Settings → Domains**，添加 `cognitionmatrixnet.cn`。
6. 按提示到阿里云域名控制台，添加 CNAME 解析：
   - 主机记录：`@`
   - 记录类型：`CNAME`
   - 记录值：Vercel 提示的 `cname.vercel-dns.com`（以实际为准）
   - TTL：600
7. 等待 DNS 生效（通常几分钟到几小时），访问 `https://cognitionmatrixnet.cn`。

> Vercel 会自动颁发 HTTPS 证书，无需额外配置。

### 备选：Cloudflare Pages

1. 打开 [dash.cloudflare.com](https://dash.cloudflare.com)，注册/登录。
2. 把 `cognitionmatrixnet.cn` 的 DNS 服务器切换到 Cloudflare（页面向导会告诉你改 NS）。
3. 进入 **Pages → Create a project → Direct upload**。
4. 上传 `dist.zip`。部署完成即可用 Cloudflare 提供的子域名访问。
5. 在项目设置里 **Custom domains** 绑定 `cognitionmatrixnet.cn`。
6. 浏览器访问 `https://cognitionmatrixnet.cn`。

---

## 三、方案 B：阿里云生态，正式上线（需备案）

如果你以后主要在内地推广，建议走这条路线。速度快、稳定、域名备案后也合规。

### 步骤 1：准备 ICP 备案

1. 登录 [阿里云备案平台](https://beian.aliyun.com/)。
2. 按向导提交域名 `cognitionmatrixnet.cn` 的备案信息。
3. 主体可以是个人或企业。个人备案通常只能做非经营类站点，企业备案更灵活。
4. 管局审核通过后，阿里云会通知你。备案期间域名可以访问海外节点（不影响方案 A 的测试）。

### 步骤 2：开通 OSS 并上传文件

1. 登录 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)。
2. 创建 Bucket：
   - 地域：选择离你用户最近的地域（如华东 1 / 杭州）。
   - 名称：例如 `cognitionmatrixnet-web`。
   - 存储类型：标准存储。
   - 读写权限：公共读。
3. 进入该 Bucket → **文件管理**，上传 `dist/` 目录下的所有文件（不是传 `dist` 文件夹本身，而是传里面的 `index.html`、`favicon.ico`、`assets/` 等）。
4. 进入 Bucket → **传输管理 → 静态页面**：
   - 默认首页：`index.html`
   - 默认 404 页：`index.html`（这一步最重要，否则子路由会 404）

### 步骤 3：绑定自定义域名并开启 HTTPS

1. Bucket → **Bucket 配置 → 域名管理**，点击 **绑定域名**。
2. 输入 `cognitionmatrixnet.cn`，确认。
3. 系统会给出 CNAME 记录值（形如 `cognitionmatrixnet-web.oss-cn-hangzhou.aliyuncs.com`）。
4. 到阿里云域名控制台添加解析：
   - 主机记录：`@`
   - 记录类型：`CNAME`
   - 记录值：刚才复制的 CNAME
   - TTL：600
5. 回到 OSS 域名管理，开启 **HTTPS**，选择**免费 SSL 证书**（阿里云会自动申请）。
6. 等 CNAME 生效后，访问 `https://cognitionmatrixnet.cn`。

---

## 四、SPA 路由回退说明（必看）

这个站点是单页应用（SPA），所有路径都应该指向 `index.html`，由 React Router 接管。

- **Vercel / Cloudflare Pages**：默认已经这样处理，一般不需要额外配置。
- **OSS**：必须在静态页面设置里把默认 404 页设成 `index.html`。
- **Nginx**：需要在配置里写：
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

---

## 五、上线前必须知道的几个功能坑

### 1. 支付功能目前不会工作

原站的支付接口调用的是：
```
https://baas-api.wanwang.xin/toc/alipay-isv/{siteId}/create-order
```
这是万小智平台提供的支付通道，脱离其托管环境后大概率会失败。如果你要保留支付，需要：
- 接入自己的支付宝当面付/手机网站支付，或
- 接入微信支付、Stripe 等，或
- 暂时隐藏支付按钮/会员页。

### 2. Supabase 数据

站点里 `/tools`、`/insights` 等页面尝试从 Supabase 读取数据。当前 `.env` 里是占位值：
```
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder
```
如果要让这些页面的数据真正可用，需要：
1. 注册 [Supabase](https://supabase.com/) 并建项目；
2. 创建对应的数据表（如 `tools`、`insights`）；
3. 把真实 URL 和 Key 填进 `.env`；
4. 重新执行 `pnpm build` 并重新上传 `dist/`。

### 3. 图片外链

`src/data/mockData.ts` 里定义了 21 张 `baas-api.wanwang.xin` 的图片 URL，但这些图片在原站当前显示中并未加载（工具卡片当前展示为图标+文字，而不是图片封面）。

如果你以后想让这些卡片显示封面图，需要：
- 把这些图片下载到自己的图床/阿里云 OSS，或
- 用 Stable Diffusion / Midjourney 重新生成同类图片，替换 `mockData.ts` 中的 URL。

### 4. Google Fonts 已移除

原 `index.html` 里有两行 Google Fonts 的 `preconnect`，我已经删除，国内访问不会因为连接 Google 域名而变卡。

---

## 六、快速部署命令（如果你继续用本项目）

```bash
# 1. 进入项目目录
cd /workspace/cognitionmatrixnet.cn

# 2. 安装依赖（已安装过可跳过）
pnpm install

# 3. 配置环境变量（按需）
cp .env.example .env   # 如果有示例文件的话
# 编辑 .env，填入你的 Supabase URL / Anon Key

# 4. 构建
pnpm build

# 5. 打包
zip -r dist.zip dist/

# 6. 把 dist/ 或 dist.zip 上传到你选择的托管平台
```

---

## 七、常见排查

| 现象 | 原因 | 处理 |
|---|---|---|
| 首页能打开，/tools 刷新 404 | SPA 路由没回退到 index.html | 按第四节的说明配置默认 404 |
| HTTPS 证书无效/提示不安全 | 域名 SSL 未生效或 CNAME 未正确解析 | 等 5-30 分钟；检查 CNAME；重新开启 OSS HTTPS |
| 页面黑屏/空白 | JS 报错；检查浏览器控制台是否有网络或 JS 错误 | 开启后反馈给我 |
| 支付按钮没反应 | 支付接口依赖万小智后端 | 按第五节第 1 点处理 |

---

## 八、推荐上线顺序

如果你是第一次做这类部署，建议按这个顺序来：

1. **先用 Vercel 免费部署**（方案 A），5 分钟内让 `cognitionmatrixnet.cn` 能访问。这样你立刻可以看到线上效果。
2. **同时提交阿里云 ICP 备案**（方案 B）。
3. 备案通过后，再切到阿里云 OSS，把域名解析改回国内节点。
4. 后续如果需要数据/支付功能，再补充 Supabase 或自己的后端。

---

> 如果有具体的平台（Vercel / 阿里云 OSS / 其他）需要我帮你生成对应的上传脚本或配置文件，直接告诉我即可。
