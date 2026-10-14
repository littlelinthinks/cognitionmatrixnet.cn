/* 认知矩阵 · 文化属性研读 —— 纯静态专栏站（零依赖，v3 基础设施版）
 * 真实 URL 路由 + 独立 SEO meta + 关于 / 学习路径页 + 订阅位
 * 改文字改 DATA；加文章往 articles 里加一段即可。 */

const SITE = {
  name: "认知矩阵 · 文化属性研读",
  base: "https://cognitionmatrixnet.cn",
  defaultDesc: "文化属性、强势文化与弱势文化、天道——一套关于认知与命运的原创解读专栏。"
};

const DATA = {
  articles: [
    {
      id: "culture-attribute",
      title: "文化属性：决定命运的底层代码",
      tag: "总论",
      date: "2026-10-13",
      excerpt: "透视一个社会、一个人，看三层：技术、制度、文化。文化属性，是那个看不见、却决定一切的底层操作系统。",
      body: `
        <p>我们习惯用眼睛看结果：谁富、谁穷，谁起、谁落。但结果之上，还有三层——<b>技术</b>、<b>制度</b>、<b>文化</b>。</p>
        <p>技术决定效率，制度决定分配，而文化，决定了前两者被如何使用。最底层的那一层，叫做<b>文化属性</b>。</p>
        <h2>什么是文化属性</h2>
        <p>它不是教科书里的定义，而是一个群体在长久的生存环境里，慢慢长成的、近乎本能的认知与行为模式。它像空气：你浸在其中，却很少察觉；它替你做决定，早于你的思考。</p>
        <blockquote>文化属性不是宿命，但它是惯性；你一旦意识到它，惯性才有被改变的可能。</blockquote>
        <h2>为什么它决定命运</h2>
        <p>因为人总是用自己「以为的世界」去行动。如果你的文化属性告诉你「出事总有人管」「强者是靠运气」，你的每一个选择都会悄悄偏向等待、偏向依附、偏向侥幸。日积月累，命运就被这套默认设置写好了。</p>
        <ul>
          <li>它决定你遇到困难时，第一反应是「想办法」还是「找靠山」；</li>
          <li>它决定你把成功归因于「规律」还是「关系」；</li>
          <li>它决定你愿不愿意为长期价值，忍受短期的不适。</li>
        </ul>
        <p>看清文化属性，不是为了评判高低，而是为了拿回一点主动权：<b>知道自己在被什么程序驱动，才有可能改写程序。</b></p>
      `
    },
    {
      id: "strong-vs-weak",
      title: "强势文化与弱势文化：一字之差，两种命运",
      tag: "核心对照",
      date: "2026-10-13",
      excerpt: "同样一张人生牌桌，两种文化属性会打出完全不同的结局。差别不在智商，而在「谁为结果负责」。",
      body: `
        <p>把人群粗略切开，会看到两种底色：<b>强势文化</b>与<b>弱势文化</b>。这不是贴标签，而是看一个人面对问题时，本能地把「原因」放在哪里。</p>
        <h2>强势文化：规律与自我负责</h2>
        <p>它相信世界有其客观规律，信「种瓜得瓜」。遇到挫折，它的第一反应是回到自己：<b>我哪里没看清规律？我还能补上什么？</b>它的底色是——我为自己的结果兜底。</p>
        <h2>弱势文化：等待与依附</h2>
        <p>它更习惯向外寻找「救世主」：等一个贵人、盼一项政策、靠一次运气。它的潜台词是——<b>总该有人来帮我，总该有个破例的机会。</b></p>
        <blockquote>弱势文化求一个「破格」，强势文化求一个「合规」——差别就在，你愿不愿直面真实的世界。</blockquote>
        <h2>一字之差</h2>
        <p>两种文化不是天生的。一个人可以在某个领域是强势的，在另一个领域是弱势的。关键不在于「我是什么人」，而在于这一次、这一件事：<b>我把因果，安放在谁身上？</b></p>
        <p>放在自己身上，你就站在了强势文化的一边；放在别人、运气、环境身上，你就把方向盘交了出去。</p>
      `
    },
    {
      id: "tiandao",
      title: "天道：按规律办事的人，就是神",
      tag: "根本法则",
      date: "2026-10-13",
      excerpt: "天道不赏善，也不罚恶，它只回应你是否符合规律。所谓神通，不过是比常人多看透了一层因果。",
      body: `
        <p>「天道」二字，听着玄远，落到地上却极朴素：<b>它就是不以人的意志为转移的客观规律。</b></p>
        <h2>神即道，道法自然</h2>
        <p>这句话的锋利之处在于——它把「神」从神坛上请了下来。神不是超自然的存在，而是<b>那个看透了规律、并老老实实照着规律行事的人</b>。</p>
        <blockquote>天道不赏善，也不罚恶；它只回应你是否符合规律。</blockquote>
        <h2>为什么大多数人身在局中看不清</h2>
        <p>不是规律藏得深，而是人总想让规律为自己开个后门：想抄近路、想破个例、想靠一次例外翻身。越想绕开规律，越被规律反噬。</p>
        <ul>
          <li>市场有市场的规律，逆势硬扛，输的是自己；</li>
          <li>人性与组织有规律的底色，违背它去管理，必遭反噬；</li>
          <li>个人成长有规律的节奏，急于求成，往往前功尽弃。</li>
        </ul>
        <p>所谓「按规律办事的人就是神」，不是说你能呼风唤雨，而是说你<b>不再和 Reality 抬杠</b>。这一退，反而进得最远。</p>
      `
    },
    {
      id: "deng-kao-yao",
      title: "「等靠要」：弱势文化的三个病灶",
      tag: "病灶剖析",
      date: "2026-10-13",
      excerpt: "等、靠、要，是弱势文化最典型的三字诀。它们彼此喂养，把一个人的主动性一点点掏空。",
      body: `
        <p>弱势文化落到日常行为上，常常浓缩成三个字：<b>等、靠、要</b>。单独看都不致命，合起来却是一套自我弱化的循环。</p>
        <h2>等：把时机交给运气</h2>
        <p>等风口、等伯乐、等时机成熟。等的过程中，行动力在蒸发，而世界不会为谁暂停。</p>
        <h2>靠：把因果交给别人</h2>
        <p>靠平台、靠关系、靠贵人。靠得越紧，自己的肌肉越萎缩；一旦靠山撤走，便措手不及。</p>
        <h2>要：把破例当成权利</h2>
        <p>要照顾、要特殊、要别人为自己破一次例。这背后是一种隐秘的期待：<b>世界本该对我网开一面。</b></p>
        <blockquote>所谓的救世主，从不存在；能救你的，只有对规律的敬畏，与对自己的负责。</blockquote>
        <h2>怎么破</h2>
        <p>不需要大彻大悟，只需要把每一次「等/靠/要」的冲动，替换成一个问题：<b>这件事，我能从自己这里拿到哪一点主动权？</b>哪怕很小，只要开始，惯性就松动了。</p>
      `
    },
    {
      id: "endure-can",
      title: "忍人所不忍，能人所不能：强势文化的修行",
      tag: "修行方法",
      date: "2026-10-13",
      excerpt: "生存空间，是别人不愿吃的苦，加上别人做不到的事。强势文化不是天赋，是一种可训练的「差值」。",
      body: `
        <p>强势文化听起来像某种天生的气质，其实它更接近一种<b>可训练的「差值」</b>。</p>
        <h2>两个差值</h2>
        <blockquote>忍人所不忍，是成本；能人所不能，是壁垒。二者相加，就是你的生存空间。</blockquote>
        <ul>
          <li><b>忍人所不忍</b>：别人不愿承受的枯燥、延迟、委屈、不确定性，你撑得住。这是你付出的成本。</li>
          <li><b>能人所不能</b>：别人做不到的专业、判断、执行、定力，你做得到。这是你筑起的壁垒。</li>
        </ul>
        <h2>差值即空间</h2>
        <p>当大多数人都在「等靠要」里消耗时，你多忍一分、多会一点，你和人群之间就拉开一段距离。这段距离，就是你的机会、你的议价权、你的自由。</p>
        <h2>修行从最小处开始</h2>
        <p>不必一上来就苦行。今天比昨天多看清一条规律，多扛住一次冲动，多做成一件别人嫌麻烦的小事——强势文化，就是这样一寸一寸长出来的。</p>
      `
    },
    {
      id: "know-to-do",
      title: "认知突围：从「知道」到「做到」的最后一公里",
      tag: "认知方法",
      date: "2026-10-13",
      excerpt: "读再多道理，不落地都是库存。真正的改变，发生在你把一条规律「用」进生活、变成肌肉记忆的那一刻。",
      body: `
        <p>很多人读完「文化属性」，会有一种恍然大悟的爽感。但爽感过后，生活照旧。问题出在哪？出在「知道」与「做到」之间，隔着一条被严重低估的鸿沟。</p>
        <h2>库存不等于装备</h2>
        <p>把道理存进脑子，就像把武器堆进仓库。仓库再满，不上战场，你还是手无寸铁。<b>认知的价值，不在于你「懂」，在于你「用」。</b></p>
        <blockquote>知道天道，是开始；活出天道，才是修行。中间那段路，没有人替你走。</blockquote>
        <h2>最后一公里靠什么</h2>
        <ul>
          <li><b>靠具体</b>：别喊「我要变强」，喊「今晚我把这条规律写成一条行动清单」；</li>
          <li><b>靠重复</b>：一次照规律做事是巧合，一百次是习惯，一千次才是文化属性；</li>
          <li><b>靠环境</b>：把自己放进能强化好习惯的场域，比靠意志力硬扛省十倍力气。</li>
        </ul>
        <h2>给自己一个「最小行动」</h2>
        <p>别等准备好。今天就挑一条你认同的规律，落到一件最小的事上：多忍一次冲动，多问一句「规律是什么」，多扛住一次想「等靠要」的念头。认知突围，从来不是想通了才动，而是动着动着，就想通了。</p>
      `
    },
    {
      id: "weak-env-strong-self",
      title: "在弱势环境里，活成强势文化",
      tag: "破局思维",
      date: "2026-10-13",
      excerpt: "环境不由你选，但你可以选择不和它共沉沦。弱势环境里，恰恰藏着强势文化最硬的修行场。",
      body: `
        <p>有人问：我身边的人都在「等靠要」，我一个人较劲，是不是太傻？我的回答是：<b>弱势环境不会因为你顺从它就放过你，但它会奖励那个逆着惯性长出力量的人。</b></p>
        <h2>环境是土壤，不是判决</h2>
        <p>土壤贫瘠，庄稼确实难长；但难长不等于不长。强势文化的人，会把贫瘠当成训练——别人靠关系，他练本事；别人等风口，他造能力。</p>
        <blockquote>弱势文化的悲剧，不是环境差，而是把环境当成了放弃的借口。</blockquote>
        <h2>三种「悄悄突围」的方式</h2>
        <ul>
          <li><b>信息突围</b>：在周围都在聊八卦时，你给自己留一块读规律、学真东西的自留地；</li>
          <li><b>圈子突围</b>：线上线下去靠近那些「按规律办事」的人，哪怕只是隔着屏幕观察；</li>
          <li><b>微习惯突围</b>：每天做一件「别人不做、但符合规律」的小事，积少成多，你会慢慢脱离原来的引力。</li>
        </ul>
        <h2>你不是在对抗谁</h2>
        <p>活成强势文化，不是为了证明谁错，而是为了<b>把自己从默认的弱者剧本里拽出来</b>。当你真的长出力量，你反而能成为身边人的那束光——这，才是文化属性最温柔的意义。</p>
      `
    }
  ],

  concepts: [
    { icon: "◈", title: "文化属性", text: "一个群体在长久生存环境中形成的、近乎本能的认知与行为模式。它是决定个人与群体命运的底层代码。" },
    { icon: "▲", title: "强势文化", text: "遵循客观规律、自我负责、自强不息的文化。它的底色是：我为自己的结果兜底。" },
    { icon: "▼", title: "弱势文化", text: "依赖强者、期盼救世主、破格获取的文化。它的三字诀是：等、靠、要。" },
    { icon: "✦", title: "天道", text: "不以人的意志为转移的客观规律。「神即道，道法自然」——按规律办事的人，就是神。" }
  ],

  quotes: [
    { q: "所谓的救世主，从不存在；能救你的，只有对规律的敬畏，与对自己的负责。", src: "文化属性研读" },
    { q: "弱势文化求一个「破格」，强势文化求一个「合规」——差别就在你愿不愿直面真实的世界。", src: "文化属性研读" },
    { q: "文化属性不是宿命，但它是惯性；你意识到它，惯性才有被改变的可能。", src: "文化属性研读" },
    { q: "天道不赏善，也不罚恶；它只回应你是否符合规律。", src: "文化属性研读" },
    { q: "忍人所不忍，是成本；能人所不能，是壁垒。二者相加，就是你的生存空间。", src: "文化属性研读" }
  ],

  learningPath: [
    { stage: "见地", sub: "看清框架", items: ["culture-attribute", "strong-vs-weak", "tiandao"] },
    { stage: "修行", sub: "下手用功", items: ["deng-kao-yao", "endure-can"] },
    { stage: "知行 · 破局", sub: "落地与环境", items: ["know-to-do", "weak-env-strong-self"] }
  ]
};

/* ============ 基础设施：SEO meta（标题 / 描述 / canonical） ============ */
function setMeta(title, desc) {
  document.title = title || SITE.name;
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
  m.setAttribute("content", desc || SITE.defaultDesc);
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
  const p = currentPath();
  link.setAttribute("href", SITE.base + (p === "/" ? "/" : p));
}

/* ============ 路由：真实 URL，file:// 下自动降级 hash ============ */
function currentPath() {
  if (location.protocol === "file:") {
    const h = location.hash.replace(/^#/, "");
    return (h.split("?")[0] || "/");
  }
  let p = location.pathname.replace(/\/index\.html$/i, "") || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function navigate(path) {
  if (location.protocol !== "file:") {
    try { history.pushState({ path: path }, "", path); } catch (e) {}
  } else {
    try { location.hash = path; } catch (e) {}
  }
  render();
}

/* ============ 订阅区块（预留接入邮件服务） ============ */
function subscribeBlock() {
  return `
  <section class="section subscribe">
    <div class="subscribe-inner">
      <div class="subscribe-text">
        <h2>加入<span class="accent">研读</span>通讯</h2>
        <p>每周一封，把一条文化属性规律讲透。不打扰，可随时退订。</p>
      </div>
      <form class="subscribe-form" id="subscribeForm" novalidate>
        <input type="email" name="email" placeholder="你的邮箱" aria-label="邮箱" />
        <button class="btn btn-primary" type="submit">订阅</button>
      </form>
    </div>
    <p class="subscribe-tip" id="subscribeTip">订阅服务待接入（Buttondown / Substack），当前为占位。</p>
  </section>`;
}

function bindSubscribe() {
  const form = document.getElementById("subscribeForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const tip = document.getElementById("subscribeTip");
    const email = (form.querySelector('input[name="email"]').value || "").trim();
    if (!email || email.indexOf("@") < 1) {
      if (tip) { tip.textContent = "请填写正确的邮箱地址。"; tip.classList.add("err"); }
      return;
    }
    if (tip) { tip.textContent = "已记录你的邮箱（占位）——接入邮件服务后将自动同步。"; tip.classList.remove("err"); }
    form.reset();
  });
}

/* ============ 页面 ============ */
function viewHome() {
  const featured = DATA.articles.slice(0, 3);
  return `
  <section class="hero fade-in">
    <div class="vertical-motto" aria-hidden="true">文化屬性<br>強勢 · 弱勢<br>天道</div>
    <span class="eyebrow">文化属性 · 强势文化 · 天道</span>
    <h1>认知的另一种维度</h1>
    <p class="lead">这里是一档关于「文化属性」的原创解读专栏。我们把《天道》里那套框架，拆开来讲清楚：是什么在底层决定一个人的命运，以及，你能怎么改写它。</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/path">从学习路径开始 →</a>
      <a class="btn btn-ghost" href="/column">直接读专栏</a>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <h2>四个<span class="accent">核心概念</span></h2>
      <p>理解文化属性，先记住这四块基石。</p>
    </div>
    <div class="grid grid-4">
      ${DATA.concepts.map(c => `
        <div class="card concept-card">
          <div class="icon">${c.icon}</div>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
        </div>`).join("")}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <h2>最新<span class="accent">专栏</span></h2>
      <p>从总论到修行，一条清晰的主线。</p>
    </div>
    <div class="grid grid-3">
      ${featured.map(a => `
        <a class="card article-card" href="/article/${a.id}">
          <span class="tag gold">${a.tag}</span>
          <h3>${a.title}</h3>
          <p class="excerpt">${a.excerpt}</p>
          <div class="meta">${a.date}</div>
        </a>`).join("")}
    </div>
  </section>

  <section class="section path-cta">
    <div class="path-cta-inner">
      <div>
        <h2>七篇，一条<span class="accent">进阶主线</span></h2>
        <p>从见地、修行，到知行与破局——按「学习路径」走一遍，比零散读更见效。</p>
      </div>
      <a class="btn btn-primary" href="/path">查看学习路径 →</a>
    </div>
  </section>

  ${subscribeBlock()}`;
}

function viewColumn() {
  return `
  <section class="section fade-in">
    <div class="section-head">
      <h2>专栏 · <span class="accent">全部文章</span></h2>
      <p>原创解读，持续更新。</p>
    </div>
    <div class="grid grid-2">
      ${DATA.articles.map(a => `
        <a class="card article-card" href="/article/${a.id}">
          <span class="tag">${a.tag}</span>
          <h3>${a.title}</h3>
          <p class="excerpt">${a.excerpt}</p>
          <div class="meta">${a.date}</div>
        </a>`).join("")}
    </div>
  </section>`;
}

function viewArticle(id) {
  const list = DATA.articles;
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return { html: viewNotFound(), meta: { title: "未找到 · 认知矩阵", desc: SITE.defaultDesc } };
  const a = list[idx];
  const prev = list[idx - 1];
  const next = list[idx + 1];
  const pager = `
    <div class="pager">
      ${prev ? `<a class="pager-link" href="/article/${prev.id}">← ${prev.title}</a>` : `<span></span>`}
      ${next ? `<a class="pager-link next" href="/article/${next.id}">${next.title} →</a>` : `<span></span>`}
    </div>`;
  return {
    html: `
  <article class="detail fade-in">
    <a class="back" href="/column">← 返回专栏</a>
    <div class="meta">${a.tag}　·　${a.date}</div>
    <h1>${a.title}</h1>
    <p class="lead-p">${a.excerpt}</p>
    ${a.body}
    ${pager}
    ${subscribeBlock()}
    <a class="back" href="/column" style="margin-top:18px;">← 返回专栏</a>
  </article>`,
    meta: { title: a.title + " · 认知矩阵", desc: a.excerpt }
  };
}

function viewConcepts() {
  return `
  <section class="section fade-in">
    <div class="section-head">
      <h2>概念 · <span class="accent">四块基石</span></h2>
      <p>把这四个词记住，整张地图就清晰了。</p>
    </div>
    <div class="grid grid-2">
      ${DATA.concepts.map(c => `
        <div class="card concept-card">
          <div class="icon">${c.icon}</div>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
        </div>`).join("")}
    </div>
  </section>`;
}

function viewPath() {
  const stages = DATA.learningPath.map((s, si) => {
    const cards = s.items.map(id => {
      const a = DATA.articles.find(x => x.id === id);
      if (!a) return "";
      const no = DATA.articles.findIndex(x => x.id === id) + 1;
      return `<a class="card article-card path-card" href="/article/${a.id}">
        <span class="path-step">第 ${no} 篇</span>
        <h3>${a.title}</h3>
        <p class="excerpt">${a.excerpt}</p>
      </a>`;
    }).join("");
    return `
      <div class="path-stage">
        <div class="path-stage-head">
          <span class="path-no">${si + 1}</span>
          <div class="path-stage-title"><h3>${s.stage}</h3><span class="path-sub">${s.sub}</span></div>
        </div>
        <div class="grid grid-2">${cards}</div>
      </div>`;
  }).join("");
  return `
  <section class="page fade-in">
    <div class="section-head">
      <h2>学习<span class="accent">路径</span></h2>
      <p>七篇文章，一条从「见地」到「破局」的进阶主线。按序读，或按需取。</p>
    </div>
    ${stages}
    ${subscribeBlock()}
  </section>`;
}

function viewQuotes() {
  return `
  <section class="section fade-in">
    <div class="section-head">
      <h2>语录 · <span class="accent">一句话的锋芒</span></h2>
      <p>把最锋利的那几句，单独拎出来。</p>
    </div>
    <div class="grid grid-2">
      ${DATA.quotes.map(q => `
        <div class="card quote-card">
          <div class="q">「${q.q}」</div>
          <div class="src">—— ${q.src}</div>
        </div>`).join("")}
    </div>
  </section>`;
}

function viewAbout() {
  return `
  <section class="page fade-in">
    <div class="section-head with-seal">
      <div>
        <h2>关于<span class="accent">我们</span></h2>
        <p>一间关于「文化属性」的线上研读室。</p>
      </div>
      <span class="seal" title="研读">閱</span>
    </div>
    <div class="prose">
      <h3>我们为什么在这里</h3>
      <p>「认知矩阵 · 文化属性研读」是一档原创解读专栏。我们不复述、不神化，只做一件事：把《天道》里那套关于<b>文化属性、强势文化与弱势文化、天道</b>的框架，拆开、讲透、落到地上。</p>
      <p>我们相信，决定一个人命运的，往往不是某一次选择，而是那套藏在选择背后的「文化属性」。看清它，人就多一分主动权。</p>
      <h3>我们的相信</h3>
      <ul>
        <li>按规律办事的人，就是神；</li>
        <li>救世主从不存在，能救你的，只有对规律的敬畏与对自己的负责；</li>
        <li>强势文化不是天赋，是可训练的差值。</li>
      </ul>
      <h3>主理人</h3>
      <p>这里由一位长期研读《天道》与传统文化、关注认知与组织规律的写作者主理。<i>（此处可替换为团队介绍与联系方式）</i></p>
      <blockquote>旗舰不是最大的那间店，而是最亮的那盏灯。</blockquote>
    </div>
    ${subscribeBlock()}
    <div class="disclaimer">
      <p>免责声明：本站内容均为基于「文化属性 / 天道」思想框架的<b>原创解读与评论</b>，不构成对任何作品的转载或替代；引用与化用仅为学习与讨论之用。如涉权利事宜，请联系即删。</p>
    </div>
  </section>`;
}

function viewNotFound() {
  return `
  <section class="page fade-in notfound">
    <div class="section-head"><h2>这里<span class="accent">空无一物</span></h2><p>你要找的页面，不在这座文化矩阵里。</p></div>
    <a class="btn btn-primary" href="/">回到首页</a>
  </section>`;
}

/* ============ 渲染 & 事件 ============ */
const app = document.getElementById("app");
const nav = document.getElementById("nav");

function updateNav(path) {
  nav.querySelectorAll("a").forEach(a => {
    const r = a.getAttribute("data-route");
    const active = (r === path) || (r === "/column" && path.indexOf("/article/") === 0);
    a.classList.toggle("active", active);
  });
}

function render() {
  const path = currentPath();
  let html = "", meta = { title: SITE.name, desc: SITE.defaultDesc };
  if (path === "/") html = viewHome();
  else if (path === "/column") { html = viewColumn(); meta.title = "专栏 · 全部文章 · 认知矩阵"; }
  else if (path === "/concepts") { html = viewConcepts(); meta.title = "概念 · 四块基石 · 认知矩阵"; }
  else if (path === "/path") { html = viewPath(); meta.title = "学习路径 · 认知矩阵"; }
  else if (path === "/quotes") { html = viewQuotes(); meta.title = "语录 · 认知矩阵"; }
  else if (path === "/about") { html = viewAbout(); meta.title = "关于我们 · 认知矩阵"; }
  else if (path.indexOf("/article/") === 0) { const r = viewArticle(path.slice(9)); html = r.html; meta = r.meta; }
  else { html = viewNotFound(); meta.title = "未找到 · 认知矩阵"; }

  app.innerHTML = html;
  setMeta(meta.title, meta.desc);
  updateNav(path);
  bindSubscribe();
  window.scrollTo({ top: 0, behavior: "auto" });
}

/* 站内链接统一走 pushState；放行新标签(Cmd/Ctrl)与外部链接 */
document.addEventListener("click", function (e) {
  const a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  const href = a.getAttribute("href") || "";
  if (href.charAt(0) !== "/") return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.getAttribute("target") === "_blank") return;
  e.preventDefault();
  navigate(href);
});

window.addEventListener("popstate", render);
if (location.protocol === "file:") window.addEventListener("hashchange", render);

document.getElementById("year").textContent = new Date().getFullYear();
render();
