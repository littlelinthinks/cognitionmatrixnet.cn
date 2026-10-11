# Cognition Matrix 部署说明（傻瓜版）

解压后，所有文件路径已对齐仓库根目录，直接覆盖/新增即可。

## 1. 落代码（把包内容提交到 GitHub）
```bash
cd cognitionmatrixnet.cn        # 你的仓库根
unzip cognition-matrix-delivery.zip
git add -A && git commit -m "feat: 认知矩阵知识网络系统（Schema/ Pipeline/ DAL/ 动态前端）"
git push
```
> 3 个页面（Insights/ToolLibrary/BusinessBrain）会覆盖原文件，正是改造目的。

## 2. 前端环境变量（Supabase 只读）
仓库 `.env`（及 Vercel/Netlify 环境变量）填：
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon...
```
没配前页面会自动降级到本地静态数据，**不会白屏**。

## 3. 部署两个 Edge Function（RAG 检索 + 流式问答）
```bash
supabase functions deploy rag-search
supabase functions deploy rag-chat
supabase secrets set OPENAI_API_KEY=sk-xxx
# 可选：CHAT_MODEL=gpt-4o-mini / CHAT_BASE_URL=（可切 DeepSeek 等兼容端点）
```
> Migration 已导入，`match_*` RPC 已存在。Function 用自动注入的 anon key，无需额外配 service_role。

## 4. 让 Pipeline 每日自动跑（零服务器成本）
GitHub 仓库 **Settings → Secrets → Actions** 添加：
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`（或 `DEEPSEEK_API_KEY` + `LLM_PROVIDER=deepseek`）

推送后每日 UTC 0 点自动采集 → 打分 → 入库。

## 5. 本地验证
```bash
npm install && npm run dev
# 打开 /insights、/tools 看实时数据；/business-brain 提问看流式回答 + 引用卡片
```

## 顺序一句话
解压提交 → 配前端 env → 部署两个 Function + 设密钥 → 推 backend/.github 并配 Actions Secrets → 本地跑。
