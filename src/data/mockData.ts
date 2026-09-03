export interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  downloadCount: number;
  coverUrl: string;
  downloadUrl: string;
  extractCode: string;
  aiRecommend?: boolean;
  useCase?: string;
  bestPrompt?: string;
}

export interface InsiderItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  price: number;
  coverUrl: string;
  content: string;
}

export interface TickerItem {
  id: string;
  user: string;
  action: string;
  target: string;
}

export interface InsightItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  coverUrl: string;
  publishDate: string;
  readTime: number;
}

export interface BrainEngine {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

export const toolCategories = [
  "全部",
  "商业",
  "销售",
  "营销",
  "外贸",
  "内容",
  "办公",
  "设计",
  "数据分析",
  "自动化",
];

export const tools: ToolItem[] = [
  {
    id: "t1",
    title: "AI短视频矩阵自动剪辑与发布系统",
    description: "AI驱动的批量视频素材智能剪辑、字幕自动生成与多平台定时发布系统。",
    category: "内容",
    tags: ["自动化", "视频处理"],
    downloadCount: 12847,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-video-editing-automation-interface.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example1",
    extractCode: "mn3k",
    aiRecommend: true,
    useCase: "自媒体矩阵运营、短视频批量生产",
    bestPrompt: "帮我批量剪辑10条60秒短视频，自动添加字幕和背景音乐",
  },
  {
    id: "t2",
    title: "AI办公数据智能清洗与分析平台",
    description: "AI驱动的数据批量处理工具集，支持自动去重、格式标准化、智能报表生成。",
    category: "数据分析",
    tags: ["自动化", "办公效率"],
    downloadCount: 9632,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/data-analytics-dashboard-dark.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example2",
    extractCode: "dx7p",
    aiRecommend: true,
    useCase: "财务报表整理、销售数据分析",
    bestPrompt: "分析这份Excel数据，找出销售额Top10产品和趋势变化",
  },
  {
    id: "t3",
    title: "AI营销内容生成与SEO优化工具",
    description: "基于GPT的营销文案、社交媒体内容、SEO文章自动生成与优化工具。",
    category: "营销",
    tags: ["AI工具", "内容生成"],
    downloadCount: 15291,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-content-marketing-seo-tool.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example3",
    extractCode: "vd2m",
    aiRecommend: true,
    useCase: "品牌营销、社交媒体运营、SEO优化",
    bestPrompt: "为我的SaaS产品写一篇2000字的SEO优化文章，目标关键词是AI办公工具",
  },
  {
    id: "t4",
    title: "AI公文写作辅助与智能排比句库",
    description: "体制内写作效率工具，涵盖汇报材料、工作总结、述职报告等30+场景模板。",
    category: "办公",
    tags: ["办公效率", "体制内"],
    downloadCount: 8456,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/document-writing-assistant-tool.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example4",
    extractCode: "gw9r",
    useCase: "政府机关、事业单位公文写作",
    bestPrompt: "帮我写一份年度工作总结报告，重点突出数字化转型成果",
  },
  {
    id: "t5",
    title: "AI外贸客户开发与邮件自动化系统",
    description: "智能客户画像构建、开发信自动生成、邮件批量发送与跟进提醒。",
    category: "外贸",
    tags: ["AI工具", "自动化"],
    downloadCount: 6723,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/email-automation-workflow-diagram.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example5",
    extractCode: "em4w",
    aiRecommend: true,
    useCase: "外贸客户开发、B2B销售",
    bestPrompt: "为德国市场的工业设备买家写一封开发信，突出性价比和交期优势",
  },
  {
    id: "t6",
    title: "AI会议纪要与待办提取工具",
    description: "自动识别语音转文字内容，提取关键决策与待办事项，生成结构化纪要。",
    category: "办公",
    tags: ["AI工具", "自动化"],
    downloadCount: 7891,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/meeting-notes-ai-summary-interface.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example6",
    extractCode: "mt6q",
    useCase: "团队会议、项目复盘、客户沟通记录",
    bestPrompt: "总结这次会议的关键决策和待办事项，按优先级排列",
  },
  {
    id: "t7",
    title: "AI销售漏斗分析与CRM自动化",
    description: "智能销售线索评分、客户跟进提醒、销售预测与漏斗可视化分析。",
    category: "销售",
    tags: ["AI工具", "数据分析"],
    downloadCount: 5438,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/sales-funnel-analytics-dashboard.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example7",
    extractCode: "fl8n",
    aiRecommend: true,
    useCase: "B2B销售管理、客户跟进优化",
    bestPrompt: "分析我的销售漏斗数据，找出转化率最低的环节并给出优化建议",
  },
  {
    id: "t8",
    title: "AI商业计划书与财务模型生成器",
    description: "基于行业数据自动生成商业计划书框架、财务预测模型与融资方案。",
    category: "商业",
    tags: ["AI工具", "商业分析"],
    downloadCount: 11024,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/business-plan-generator-dashboard.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example8",
    extractCode: "rp3j",
    aiRecommend: true,
    useCase: "创业融资、商业规划、项目立项",
    bestPrompt: "为我的AI教育SaaS项目生成一份商业计划书，包含3年财务预测",
  },
  {
    id: "t9",
    title: "AI竞品监控与市场情报系统",
    description: "实时追踪竞品动态、价格变化、用户评价，生成竞争分析报告。",
    category: "商业",
    tags: ["AI工具", "市场分析"],
    downloadCount: 4567,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/competitive-intelligence-monitoring-dashboard.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example9",
    extractCode: "ci5x",
    useCase: "竞品分析、市场情报收集",
    bestPrompt: "监控我的3个主要竞品最近30天的动态变化，生成对比分析报告",
  },
  {
    id: "t10",
    title: "AI设计素材生成与品牌视觉工具",
    description: "AI驱动的海报、Banner、社交媒体图片自动生成，支持品牌风格定制。",
    category: "设计",
    tags: ["AI工具", "设计素材"],
    downloadCount: 8932,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-design-creative-tool-interface.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example10",
    extractCode: "ds7k",
    useCase: "品牌视觉设计、社交媒体素材制作",
    bestPrompt: "生成一张科技感十足的AI产品发布海报，主色调蓝黑色",
  },
  {
    id: "t11",
    title: "AI RPA流程自动化编排平台",
    description: "可视化拖拽式RPA流程编排，支持跨系统数据同步与任务自动化。",
    category: "自动化",
    tags: ["RPA自动化", "流程编排"],
    downloadCount: 6234,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/rpa-automation-workflow-builder.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example11",
    extractCode: "rp9m",
    useCase: "跨系统数据同步、重复性任务自动化",
    bestPrompt: "帮我创建一个自动从邮箱提取发票信息并录入财务系统的流程",
  },
  {
    id: "t12",
    title: "AI跨境电商选品与listing优化工具",
    description: "基于市场数据的智能选品分析、Listing标题优化与关键词研究。",
    category: "外贸",
    tags: ["AI工具", "跨境电商"],
    downloadCount: 7654,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/cross-border-ecommerce-product-analysis.jpg?w=400&h=250",
    downloadUrl: "https://pan.quark.cn/s/example12",
    extractCode: "ec4p",
    aiRecommend: true,
    useCase: "亚马逊、速卖通等跨境电商运营",
    bestPrompt: "分析美国市场家居品类的热销趋势，推荐5个潜力选品方向",
  },
];

export const insiderCategories = [
  "全部",
  "行业白皮书",
  "职场指南",
  "公文范本",
  "趋势分析",
];

export const insiders: InsiderItem[] = [
  {
    id: "i1",
    title: "2026 AI商业智能趋势白皮书：企业数字化转型新范式",
    summary: "深度解析2026年AI商业智能领域的关键趋势，涵盖AI Agent渗透率、自动化决策普及度与效率提升数据。",
    category: "行业白皮书",
    price: 19.9,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/digital-transformation-report-cover.jpg?w=400&h=250",
    content: "完整白皮书内容（5000+字深度分析报告，涵盖行业数据、趋势预测与实操建议）...",
  },
  {
    id: "i2",
    title: "AI销售系统实战指南：从线索到成交的全流程自动化",
    summary: "系统整理AI销售系统的最佳实践，涵盖客户画像构建、智能跟进、成交预测等核心环节。",
    category: "职场指南",
    price: 19.9,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-sales-system-guide.jpg?w=400&h=250",
    content: "完整实战指南内容（包含AI销售系统全流程操作手册与案例）...",
  },
  {
    id: "i3",
    title: "跨境电商AI工具全景图：2026年选品与运营效率提升方案",
    summary: "全面梳理跨境电商领域的AI工具，按选品、运营、营销分类对比，提供选型建议。",
    category: "趋势分析",
    price: 19.9,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/cross-border-ecommerce-ai-tools.jpg?w=400&h=250",
    content: "完整工具全景图（涵盖50+款跨境电商AI工具的功能对比与推荐）...",
  },
  {
    id: "i4",
    title: "企业AI知识库建设方法论：从0到1的完整指南",
    summary: "系统讲解企业AI知识库的建设流程、技术选型、内容治理与持续运营策略。",
    category: "行业白皮书",
    price: 19.9,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/enterprise-ai-knowledge-base.jpg?w=400&h=250",
    content: "完整建设方法论（涵盖技术架构、内容治理、运营策略与ROI分析）...",
  },
  {
    id: "i5",
    title: "AI时代个人竞争力重塑：5个关键能力升级路径",
    summary: "基于对1000+职场人的调研，提炼AI时代个人竞争力升级的核心路径与实操方法。",
    category: "职场指南",
    price: 19.9,
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-era-competitiveness-guide.jpg?w=400&h=250",
    content: "完整竞争力指南（5个关键能力的详细升级路径与案例）...",
  },
];

export const tickerData: TickerItem[] = [
  { id: "d1", user: "139****3910", action: "解锁了", target: "《AI商业智能趋势白皮书》" },
  { id: "d2", user: "186****7724", action: "下载了", target: "《AI数据分析工具包》" },
  { id: "d3", user: "158****2051", action: "使用了", target: "AI商业大脑分析" },
  { id: "d4", user: "177****8863", action: "开通了", target: "Pro会员" },
  { id: "d5", user: "135****6642", action: "下载了", target: "《AI外贸邮件系统》" },
  { id: "d6", user: "189****1197", action: "解锁了", target: "《AI销售实战指南》" },
  { id: "d7", user: "152****4480", action: "完成了", target: "AI个人诊断" },
  { id: "d8", user: "131****9935", action: "生成了", target: "AI商业计划书" },
];

export const vipBenefits = [
  { text: "无限使用全站AI工具与自动化系统", value: "5800" },
  { text: "每周独家行业情报与AI分析报告", value: "1999" },
  { text: "AI商业大脑全功能访问权限", value: "2999" },
  { text: "AI Agent中心无限生成次数", value: "1999" },
  { text: "会员专属社区与专家答疑", value: "999" },
];

export const insightItems: InsightItem[] = [
  {
    id: "ins1",
    title: "2026年Q3 AI Agent市场格局：五大玩家深度对比",
    summary: "深入分析当前AI Agent市场的竞争格局，对比五大头部玩家的产品能力、商业模式与增长策略。",
    category: "AI前沿",
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-agent-market-landscape-2026.jpg?w=400&h=250",
    publishDate: "2026-08-08",
    readTime: 12,
  },
  {
    id: "ins2",
    title: "制造业数字化转型报告：AI如何降低30%运营成本",
    summary: "基于50+家制造企业的实地调研，揭示AI在供应链管理、质量控制、生产排程中的实际应用效果。",
    category: "行业报告",
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/manufacturing-digital-transformation-ai.jpg?w=400&h=250",
    publishDate: "2026-08-05",
    readTime: 15,
  },
  {
    id: "ins3",
    title: "跨境电商新政策解读：东南亚市场准入规则变化",
    summary: "详细解读东南亚主要国家最新的跨境电商政策变化，以及对卖家的影响与应对策略。",
    category: "政策解读",
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/southeast-asia-ecommerce-policy-update.jpg?w=400&h=250",
    publishDate: "2026-08-03",
    readTime: 8,
  },
  {
    id: "ins4",
    title: "AI营销工具ROI分析：哪些工具真正带来增长",
    summary: "对市场上30+款AI营销工具进行ROI实测，揭示哪些工具真正能带来可量化的业务增长。",
    category: "商业趋势",
    coverUrl: "https://baas-api.wanwang.xin/toc/image/preview/ai-marketing-tools-roi-analysis.jpg?w=400&h=250",
    publishDate: "2026-07-30",
    readTime: 10,
  },
];

export const brainEngines: BrainEngine[] = [
  { id: "b1", title: "市场分析AI", desc: "实时追踪市场动态，识别增长机会与风险信号", icon: "chart-line", color: "neon-blue" },
  { id: "b2", title: "竞争分析AI", desc: "深度解析竞争对手策略，发现差异化优势", icon: "chess", color: "neon-green" },
  { id: "b3", title: "客户画像AI", desc: "构建精准客户画像，优化获客与留存策略", icon: "users", color: "gold" },
  { id: "b4", title: "销售策略AI", desc: "基于数据驱动的销售预测与策略推荐", icon: "bullseye", color: "neon-blue" },
  { id: "b5", title: "行业研究AI", desc: "行业趋势洞察，前瞻性研究报告生成", icon: "microscope", color: "neon-green" },
  { id: "b6", title: "商业机会发现AI", desc: "挖掘隐藏商业机会，评估可行性与ROI", icon: "lightbulb", color: "gold" },
];
