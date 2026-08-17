// ============================================================
// MES 低保真原型生成器 · Figma 插件
// 依据 HTML 低保真原型（8 页面）在 Figma 中生成：
//   · 8 个页面 Frame（1280×800，浅灰底）
//   · 每页顶部导航栏（深蓝底 + 8 个导航链接）
//   · 面板 / 表格 / 按钮 / 标签 / 步骤条 / 看板卡片
//   · 原型交互：导航链接与登录按钮点击跳转对应页面
// 使用：Figma 桌面端 → 菜单 Plugins → Development → Import
// ============================================================
const MES_DATA = {"pages":[{"id":"login","name":"登录","blocks":[{"type":"h1","text":"MES 制造执行系统"},{"type":"sub","text":"演示原型 v0.1 · 汽车零部件模具制造"},{"type":"text","text":"用户名[输入:如 admin / planner] 密　码[输入:••••••] "},{"type":"muted","text":"演示账号：admin（管理员）/ planner（计划科）/ director（车间主任）/ proj01（项目科）/ design01（设计科）/ prog01（编程科）/ wh01（仓库科）/ op01-op05（操作工）/ quality（质量科）"},{"type":"muted","text":"交互：登录后按角色跳转对应首页；密码错误提示"}]},{"id":"shopfloor","name":"工位执行端","blocks":[{"type":"topbar","parts":["工位：CNC 1# ｜ 操作工：张三"],"rights":[{"cls":"btn sm","text":"退出"}]},{"type":"panel","title":null,"children":[{"type":"text","text":"当前任务：MOLD-1001 前门内板拉延模","role":"h1"},{"type":"text","text":"工序 2/6 CNC 粗加工 ｜ 加工组：大件组（3 件）｜ 编程号：P-1001-2 ｜ 铁板规格：12mm×2000×1000","role":"sub"},{"type":"steps","items":[{"num":"1","title":"扫码开工","extra":"[输入:SN 或回车]"},{"num":"2","title":"绑定铁板批次","extra":"[输入:批次标签或回车]"},{"num":"3","title":"报工 + 提交确认","extra":"数量 [输入:]工时 [输入:]"}]},{"type":"text","text":""},{"type":"text","text":""},{"type":"buttons","items":[{"cls":"btn primary","text":"④ 提交确认 → 待审核"}]},{"type":"text","text":"提示：扫码枪 = 键盘回车，3 步闭环"}]},{"type":"panel","title":{"type":"text","text":"安灯上报"},"children":[{"type":"buttons","items":[{"cls":"btn","text":"缺料"},{"cls":"btn","text":"设备"},{"cls":"btn","text":"质量"},{"cls":"btn","text":"其他"}]}]},{"type":"muted","text":"权限：仅本工位任务；数据范围=自己；提交后状态置为「待审核」"}]},{"id":"scheduling","name":"排产工作台","blocks":[{"type":"topbar","parts":["排产工作台（计划科）"],"rights":[{"cls":"btn sm primary","text":"模拟模式"},{"cls":"btn sm","text":"正式模式"}]},{"type":"panel","title":{"type":"text","text":"待排工单队列"},"children":[{"headers":[{"text":"工单号"},{"text":"产品"},{"text":"承诺交期"},{"text":"风险"},{"text":"操作"}],"rows":[[{"text":"WO-001"},{"text":"前门内板拉延模"},{"text":"3/31"},{"text":"⚠️ 逾期2天","tag":"red"},{"text":"倒排建议","btn":"primary"}],[{"text":"WO-002"},{"text":"A柱加强板翻边模"},{"text":"4/05"},{"text":"正常","tag":"green"},{"text":"倒排建议","btn":""}]]}]},{"type":"panel","title":{"type":"text","text":"建议排期（交期倒排结果 · WO-001）"},"children":[{"headers":[{"text":"工序"},{"text":"最晚开始"},{"text":"最晚结束"},{"text":"工位"},{"text":"状态"}],"rows":[[{"text":"设计"},{"text":"3/17"},{"text":"3/18"},{"text":"D1"},{"text":"正常","tag":"green"}],[{"text":"CNC 加工组"},{"text":"3/19"},{"text":"3/21"},{"text":"CNC 1#"},{"text":"⚠️ 与 WO-003 冲突","tag":"orange"}],[{"text":"热处理"},{"text":"3/22"},{"text":"3/23"},{"text":"H1"},{"text":"正常","tag":"green"}],[{"text":"EDM 精加工"},{"text":"3/24"},{"text":"3/26"},{"text":"EDM 3#"},{"text":"正常","tag":"green"}],[{"text":"钳工装配"},{"text":"3/27"},{"text":"3/28"},{"text":"装配 2#"},{"text":"待齐套(缺2项)","tag":"gray"}],[{"text":"试模"},{"text":"3/29"},{"text":"3/31"},{"text":"试模台 1#"},{"text":"正常","tag":"green"}]]},{"type":"text","text":"（每次调整后重算冲突与交期，只提示不强制）"},{"type":"buttons","items":[{"cls":"btn","text":"改开始时间"},{"cls":"btn","text":"换工位"},{"cls":"btn primary","text":"即时重算"}]}]}]},{"id":"review","name":"审核工作台","blocks":[{"type":"topbar","parts":["审核工作台（车间主任）","待审核：3 项"],"rights":[]},{"type":"panel","title":{"type":"text","text":"待审核列表"},"children":[{"headers":[{"text":"工单"},{"text":"工序/环节"},{"text":"提交人"},{"text":"提交时间"},{"text":"操作"}],"rows":[[{"text":"WO-001"},{"text":"CNC 加工组"},{"text":"张三"},{"text":"10:32"},{"text":"驳回","btn":"danger"}],[{"text":"WO-001"},{"text":"钳工装配"},{"text":"李四"},{"text":"09:15"},{"text":"驳回","btn":"danger"}],[{"text":"WO-002"},{"text":"设计审核"},{"text":"王工"},{"text":"08:40"},{"text":"驳回","btn":"danger"}]]},{"type":"text","text":"驳回弹窗：原因（必填）[输入:如 尺寸超差，需返工] "},{"type":"buttons","items":[{"cls":"btn danger","text":"确认驳回 → 退回提交人"},{"cls":"btn","text":"取消"}]}]},{"type":"panel","title":{"type":"text","text":"已审核记录（可查）"},"children":[{"headers":[{"text":"工单"},{"text":"环节"},{"text":"审核人"},{"text":"结果"},{"text":"时间"},{"text":"原因"}],"rows":[[{"text":"WO-002"},{"text":"设计"},{"text":"设计科长"},{"text":"通过","tag":"green"},{"text":"3/18"},{"text":"—"}],[{"text":"WO-001"},{"text":"编程"},{"text":"编程科长"},{"text":"驳回","tag":"red"},{"text":"3/19"},{"text":"程序路径需修正"}]]}]},{"type":"muted","text":"权限：车间主任审厂房全部工序；各科科长审本科室；驳回不限次数、退回上一环节成员附原因"}]},{"id":"board","name":"生产看板","blocks":[{"type":"topbar","parts":["生产进度看板（自动刷新 10s）"],"rights":[{"cls":"btn sm","text":"全屏"}]},{"type":"board","cards":[{"title":"在产工单","big":"","muted":"6完成 2 · 逾期风险 1"},{"title":"今日报工","big":"","muted":"128待审核 5"},{"title":"齐套检查","big":"","muted":"2/6缺料工单 1"},{"title":"安灯","big":"","muted":"2缺料 1 · 质量 1"}]},{"type":"panel","title":{"type":"text","text":"产线进度"},"children":[{"headers":[{"text":"产线"},{"text":"工单"},{"text":"当前工序"},{"text":"进度"},{"text":"达成率"},{"text":"风险"}],"rows":[[{"text":"CNC"},{"text":"WO-001"},{"text":"3/6 热处理"},{"text":""},{"text":"75%"},{"text":"正常","tag":"green"}],[{"text":"CNC"},{"text":"WO-002"},{"text":"1/6 设计"},{"text":""},{"text":"20%"},{"text":"临期","tag":"orange"}],[{"text":"装配"},{"text":"WO-001"},{"text":"齐套检查"},{"text":""},{"text":"—"},{"text":"待齐套(缺2项)","tag":"gray"}]]},{"type":"text","text":""},{"type":"text","text":""},{"type":"text","text":""}]},{"type":"panel","title":{"type":"text","text":"安灯实时"},"children":[{"headers":[{"text":"工位"},{"text":"类型"},{"text":"持续"},{"text":"状态"},{"text":"处理"}],"rows":[[{"text":"CNC 2#"},{"text":"🔴 缺料","tag":"red"},{"text":"14 min"},{"text":"待处理"},{"text":"处理","btn":""}],[{"text":"装配 1#"},{"text":"🟡 质量","tag":"orange"},{"text":"5 min"},{"text":"待处理"},{"text":"处理","btn":""}]]}]},{"type":"muted","text":"权限：全员可见；操作工限本组；质量科只读；交期风险逾期红色高亮"}]},{"id":"trace","name":"追溯中心","blocks":[{"type":"topbar","parts":["追溯中心"],"rights":[{"cls":"btn sm primary","text":"正向：SN"},{"cls":"btn sm","text":"反向：批次"}]},{"type":"panel","title":{"type":"text","text":"正向追溯 · SN：MOLD-2025-0001"},"children":[{"headers":[{"text":"环节"},{"text":"时间"},{"text":"执行人"},{"text":"工位"},{"text":"结果"},{"text":"审核"}],"rows":[[{"text":"设计"},{"text":"3/17"},{"text":"王工"},{"text":"D1"},{"text":"完成"},{"text":"科长通过","tag":"green"}],[{"text":"CNC 加工组"},{"text":"3/19-21"},{"text":"张三"},{"text":"CNC 1#"},{"text":"完成"},{"text":"主任通过","tag":"green"}],[{"text":"热处理"},{"text":"3/22-23"},{"text":"（外协/炉）"},{"text":"H1"},{"text":"完成"},{"text":"主任通过","tag":"green"}],[{"text":"钳工装配"},{"text":"3/27-28"},{"text":"李四"},{"text":"装配 2#"},{"text":"完成"},{"text":"主任通过","tag":"green"}],[{"text":"试模"},{"text":"3/29-31"},{"text":"赵工"},{"text":"试模台 1#"},{"text":"样板 ×1"},{"text":"主任通过","tag":"green"}]]}]},{"type":"panel","title":{"type":"text","text":"用料追溯"},"children":[{"headers":[{"text":"类别"},{"text":"物料"},{"text":"批次/来源"},{"text":"数量"}],"rows":[[{"text":"自制件铁板"},{"text":"模架板 12mm"},{"text":"批次 B-001（供应商/炉号）"},{"text":"1 张"}],[{"text":"外购件"},{"text":"导柱 φ40"},{"text":"库存（项目申购到货）"},{"text":"4 件"}],[{"text":"外购件"},{"text":"导套 φ60"},{"text":"库存"},{"text":"4 件"}]]},{"type":"text","text":""},{"type":"buttons","items":[{"cls":"btn","text":"导出 CSV"}]}]},{"type":"muted","text":"反向追溯：输入铁板批次号 → 列出受影响模具清单（质量问题快速定位）"}]},{"id":"wo","name":"工单列表","blocks":[{"type":"topbar","parts":["工单管理（计划科）"],"rights":[{"cls":"btn sm primary","text":"+ 新建工单"}]},{"type":"panel","title":null,"children":[{"headers":[{"text":"工单号"},{"text":"项目"},{"text":"产品"},{"text":"交期"},{"text":"当前环节"},{"text":"状态"},{"text":"风险"}],"rows":[[{"text":"WO-001"},{"text":"P-2025-01"},{"text":"前门内板拉延模"},{"text":"3/31"},{"text":"钳工装配（待齐套）"},{"text":"生产中"},{"text":"正常","tag":"green"}],[{"text":"WO-002"},{"text":"P-2025-02"},{"text":"A柱加强板翻边模"},{"text":"4/05"},{"text":"设计（审核中）"},{"text":"生产中"},{"text":"临期","tag":"orange"}],[{"text":"WO-003"},{"text":"P-2025-03"},{"text":"翼子板冲孔模"},{"text":"4/10"},{"text":"模拟排期"},{"text":"已排产"},{"text":"正常","tag":"green"}]]},{"type":"text","text":"筛选：状态 / 产品 / 交期 / 产线 ｜ 交期风险列表（逾期/临期高亮）","role":"muted"}]},{"type":"panel","title":{"type":"text","text":"工单详情（WO-001）· 工序时间线"},"children":[{"headers":[{"text":"序号"},{"text":"工序"},{"text":"计划"},{"text":"实际"},{"text":"状态"},{"text":"审核"}],"rows":[[{"text":"1"},{"text":"设计"},{"text":"3/17-18"},{"text":"3/17-18"},{"text":"完成"},{"text":"科长✅"}],[{"text":"2"},{"text":"CNC 加工组"},{"text":"3/19-21"},{"text":"3/19-21"},{"text":"完成"},{"text":"主任✅"}],[{"text":"3"},{"text":"热处理"},{"text":"3/22-23"},{"text":"3/22-23"},{"text":"完成"},{"text":"主任✅"}],[{"text":"4"},{"text":"EDM 精加工"},{"text":"3/24-26"},{"text":"—"},{"text":"待执行"},{"text":"—"}]]}]}]},{"id":"project","name":"项目台账","blocks":[{"type":"topbar","parts":["项目台账（项目科）"],"rights":[{"cls":"btn sm primary","text":"+ 新建项目"}]},{"type":"panel","title":null,"children":[{"headers":[{"text":"项目编号"},{"text":"名称"},{"text":"客户"},{"text":"图纸引用"},{"text":"状态"},{"text":"进度"}],"rows":[[{"text":"P-2025-01"},{"text":"某车型门板模具开发"},{"text":"车架事业部"},{"text":"DW-2201"},{"text":"开发中"},{"text":"3/6 工序"}],[{"text":"P-2025-02"},{"text":"某车型侧围模具开发"},{"text":"车架事业部"},{"text":"DW-2203"},{"text":"模拟排期"},{"text":"1/6"}]]},{"type":"text","text":"启动会记录（线下）：kickoff_note ｜ 排期模拟 → 线上演示 → 确认发布","role":"muted"}]},{"type":"panel","title":{"type":"text","text":"外购件申购（项目科发起 → 仓库科到货）"},"children":[{"headers":[{"text":"申购单"},{"text":"外购件"},{"text":"数量"},{"text":"需求日期"},{"text":"状态"}],"rows":[[{"text":"PR-001"},{"text":"导柱 φ40"},{"text":"4"},{"text":"3/25"},{"text":"已到货","tag":"green"}],[{"text":"PR-002"},{"text":"标准件组套"},{"text":"1"},{"text":"3/28"},{"text":"申请中","tag":"orange"}]]}]}]}]};

// ---------- 基础常量 ----------
const PAGE_W = 1280, PAGE_H = 800;
const TOPBAR_H = 44;
const NAV = [
  { id: "login",      label: "登录" },
  { id: "shopfloor",  label: "工位执行端" },
  { id: "scheduling", label: "排产工作台" },
  { id: "review",     label: "审核工作台" },
  { id: "board",      label: "生产看板" },
  { id: "trace",      label: "追溯中心" },
  { id: "wo",         label: "工单列表" },
  { id: "project",    label: "项目台账" },
];
const C = {
  pageBg:   "#e8e8e8",
  topbar:   "#2c3e50",
  topLink:  "#cfe0f0",
  topActive:"#3498db",
  panelBg:  "#fafafa",
  panelBd:  "#bbbbbb",
  tableBd:  "#999999",
  thBg:     "#f4f6f8",
  btnBg:    "#f0f0f0",
  btnBd:    "#777777",
  primary:  "#3498db", primaryBd: "#2980b9",
  warn:     "#e67e22", warnBd:     "#d35400",
  danger:   "#e74c3c", dangerBd:   "#c0392b",
  tagGreen: "#1e8449", tagGreenBg: "#eafaf1",
  tagOrange:"#ca6f1e", tagOrangeBg:"#fef5e7",
  tagRed:   "#c0392b", tagRedBg:   "#fdedec",
  tagGray:  "#666666", tagGrayBg:  "#f2f2f2",
  txt:      "#333333",
  muted:    "#999999",
  sub:      "#888888",
  white:    "#ffffff",
};
const FONT_CANDIDATES = ["PingFang SC", "PingFang HK", "Hiragino Sans GB",
  "Noto Sans CJK SC", "Microsoft YaHei", "PingFangSC-Regular", "Arial", "Helvetica Neue"];

let FONT = null;          // 主字体（Regular）
let FONT_BOLD = null;     // 粗体（可能回退 Regular）

// ---------- 工具 ----------
function hex(h) {
  const s = h.replace("#", "");
  return { r: parseInt(s.slice(0, 2), 16) / 255, g: parseInt(s.slice(2, 4), 16) / 255, b: parseInt(s.slice(4, 6), 16) / 255 };
}
// 估算文本宽度（中文=字号，其余≈0.6×字号）
function tw(str, size) {
  let w = 0;
  for (const ch of String(str || "")) {
    w += /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F]/.test(ch) ? size : size * 0.6;
  }
  return w;
}

// ---------- 节点工厂（创建后挂到 parent） ----------
function makeRect(x, y, w, h, opts = {}) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, h);
  r.fills = [{ type: "SOLID", color: hex(opts.fill || "#ffffff") }];
  if (opts.stroke) {
    r.strokes = [{ type: "SOLID", color: hex(opts.stroke) }];
    r.strokeWeight = opts.strokeWeight || 1;
    r.strokeAlign = "INSIDE";
  } else {
    r.strokes = [];
  }
  if (opts.radius) r.cornerRadius = opts.radius;
  if (opts.dash) {
    r.dashPattern = opts.dash;
    r.strokeCap = "ROUND";
  }
  if (opts.name) r.name = opts.name;
  if (opts.parent) opts.parent.appendChild(r);
  return r;
}
function makeText(x, y, w, str, opts = {}) {
  const t = figma.createText();
  t.x = x; t.y = y;
  t.fontName = (opts.bold && FONT_BOLD) ? FONT_BOLD : FONT;
  t.characters = String(str || "");
  t.fontSize = opts.size || 13;
  t.fills = [{ type: "SOLID", color: hex(opts.color || C.txt) }];
  t.textAlignHorizontal = opts.align || "LEFT";
  t.resize(w, opts.h || 20);
  t.textAutoResize = "HEIGHT";
  if (opts.name) t.name = opts.name;
  if (opts.parent) opts.parent.appendChild(t);
  return t;
}

// ---------- 组件渲染（返回占用的高度） ----------
function renderBtn(x, y, label, style, sm, parent) {
  const size = sm ? 12 : 13;
  const h = sm ? 22 : 30;
  const w = Math.max(48, Math.round(tw(label, size) + (sm ? 16 : 28)));
  let fill = C.btnBg, bd = C.btnBd, fg = C.txt;
  if (style === "primary") { fill = C.primary; bd = C.primaryBd; fg = C.white; }
  if (style === "warn")    { fill = C.warn;    bd = C.warnBd;    fg = C.white; }
  if (style === "danger")  { fill = C.danger;  bd = C.dangerBd;  fg = C.white; }
  const r = makeRect(x, y, w, h, { fill, stroke: bd, radius: 4, parent });
  r.name = "按钮:" + label;
  makeText(x + 4, y + (h - 19) / 2 + 1, w - 8, label, { size, color: fg, align: "CENTER", parent });
  return { w, h };
}
function renderTag(x, y, label, color, parent) {
  const size = 12;
  const h = 22;
  const w = Math.round(tw(label, size) + 18);
  let fg, bg, bd;
  if (color === "green")  { fg = C.tagGreen;  bg = C.tagGreenBg;  bd = C.tagGreen; }
  else if (color === "orange") { fg = C.tagOrange; bg = C.tagOrangeBg; bd = C.tagOrange; }
  else if (color === "red")    { fg = C.tagRed;    bg = C.tagRedBg;    bd = C.tagRed; }
  else { fg = C.tagGray; bg = C.tagGrayBg; bd = C.tagGray; }
  const r = makeRect(x, y, w, h, { fill: bg, stroke: bd, radius: 11, parent });
  r.name = "标签:" + label;
  makeText(x + 4, y + (h - 18) / 2, w - 8, label, { size, color: fg, align: "CENTER", parent });
  return { w, h };
}
function renderButtons(x, y, items, maxW, parent) {
  const rows = [[]];
  let rowW = 0;
  for (const it of items) {
    const size = it.cls && it.cls.includes("sm") ? 12 : 13;
    const h = it.cls && it.cls.includes("sm") ? 22 : 30;
    const style = it.cls ? (it.cls.includes("primary") ? "primary" : it.cls.includes("warn") ? "warn" : it.cls.includes("danger") ? "danger" : "") : "";
    const w = Math.max(48, Math.round(tw(it.text || "", size) + (it.cls && it.cls.includes("sm") ? 16 : 28)));
    if (rowW + w + 8 > maxW && rowW > 0) {
      rows.push([]);
      rowW = 0;
    }
    rows[rows.length - 1].push({ w, h, size, style, text: it.text });
    rowW += w + 8;
  }
  let cy = y;
  let rowH = 0;
  for (const row of rows) {
    let cx = x;
    let maxH = 0;
    for (const b of row) {
      renderBtn(cx, cy, b.text, b.style, b.h === 22, parent);
      cx += b.w + 8;
      maxH = Math.max(maxH, b.h);
    }
    cy += maxH + 8;
    rowH += maxH + 8;
  }
  return rowH - 8;
}
function renderRichText(x, y, str, size = 13, color = C.txt, gap = 8, parent) {
  // 解析 [输入:xxx] 为虚线输入框占位
  const parts = String(str).split(/\[输入:([^\]]*)\]/g);
  let cx = x, totalW = 0;
  for (let i = 0; i < parts.length; i++) {
    const s = parts[i];
    if (s === "") continue;
    if (i % 2 === 0) {
      if (s.trim()) {
        const w = Math.round(tw(s, size)) + 2;
        makeText(cx, y, w, s, { size, color, parent });
        cx += w;
      }
    } else {
      const ph = s || "…";
      const w = Math.max(60, Math.round(tw(ph, size)) + 24);
      const h = 26;
      makeRect(cx, y - 3, w, h, { fill: "#ffffff", stroke: "#999999", dash: [3, 3], radius: 3, parent });
      makeText(cx + 6, y - 1, w - 10, ph, { size: 12, color: "#999999", parent });
      cx += w + gap;
    }
  }
  return { w: cx - x, h: 24 };
}
function renderTable(x, y, tbl, maxW, parent) {
  const ncol = tbl.headers.length || 1;
  const colW = maxW / ncol;
  const rowH = 34, thH = 32;
  let cy = y;
  const drawRow = (cells, isHeader) => {
    cells.forEach((cell, ci) => {
      const cx = x + ci * colW;
      const ch = isHeader ? thH : rowH;
      const r = makeRect(cx, cy, colW, ch, { fill: isHeader ? C.thBg : "#ffffff", stroke: C.tableBd, parent });
      r.name = (isHeader ? "表头" : "单元格") + ":" + (cell.text || "").slice(0, 12);
      // 进度条列（表头为“进度”）
      if (!isHeader && tbl.headers[ci] && tbl.headers[ci].text === "进度") {
        const pctIdx = tbl.headers.findIndex(h => h.text === "达成率");
        const pct = pctIdx >= 0 ? parseInt(cells[pctIdx] ? (cells[pctIdx].text || "").replace("%", "") : "") : 0;
        const barW = Math.min(colW - 24, 180);
        const barX = cx + (colW - barW) / 2;
        const barY = cy + (ch - 8) / 2;
        makeRect(barX, barY, barW, 8, { fill: "#ecf0f1", radius: 4, parent });
        if (pct > 0) {
          const w = Math.max(8, Math.round(barW * (pct / 100)));
          const r2 = makeRect(barX, barY, w, 8, { fill: pct < 40 ? C.warn : "#27ae60", radius: 4, parent });
          r2.name = "进度条";
        }
        return;
      }
      const padX = 8;
      const padY = 6;
      if (cell.tag) {
        renderTag(cx + (colW - tw(cell.text, 12) - 18) / 2, cy + (ch - 22) / 2, cell.text, cell.tag, parent);
      } else if (cell.btn !== undefined) {
        renderBtn(cx + (colW - Math.max(48, Math.round(tw(cell.text, 12) + 16))) / 2, cy + (ch - 22) / 2, cell.text, cell.btn, true, parent);
      } else {
        const w = colW - padX * 2;
        makeText(cx + padX, cy + padY - 1, w, cell.text || "", { size: 13, parent });
      }
    });
    cy += isHeader ? thH : rowH;
  };
  drawRow(tbl.headers, true);
  tbl.rows.forEach((row) => drawRow(row, false));
  return { h: cy - y, w: maxW };
}
function renderSteps(x, y, steps, maxW, parent) {
  const n = steps.length || 1;
  const gap = 10;
  const colW = (maxW - gap * (n - 1)) / n;
  const colH = 118;
  steps.forEach((st, i) => {
    const cx = x + i * (colW + gap);
    const box = makeRect(cx, y, colW, colH, { fill: "#fdfefe", stroke: "#888888", dash: [4, 4], radius: 4, parent });
    box.name = "步骤" + (i + 1);
    const d = 22;
    const circle = makeRect(cx + colW / 2 - d / 2, y + 10, d, d, { fill: C.primary, radius: d / 2, parent });
    circle.name = "序号";
    makeText(cx + colW / 2 - d / 2, y + 13, d, st.num || String(i + 1), { size: 12, color: "#ffffff", align: "CENTER", parent });
    makeText(cx + 6, y + 40, colW - 12, st.title || "", { size: 13, align: "CENTER", parent });
    if (st.extra) {
      renderRichText(cx + 10, y + 66, st.extra, 12, C.muted, 4, parent);
    }
  });
  return colH;
}
function renderBoard(x, y, board, maxW, parent) {
  const n = board.cards.length || 1;
  const gap = 12;
  const colW = (maxW - gap * (n - 1)) / n;
  const cardH = 96;
  board.cards.forEach((card, i) => {
    const cx = x + i * (colW + gap);
    const c = makeRect(cx, y, colW, cardH, { fill: "#fdfefe", stroke: "#999999", radius: 4, parent });
    c.name = "看板卡:" + card.title;
    makeText(cx + 12, y + 12, colW - 24, card.title || "", { size: 13, color: "#666666", parent });
    const bigColor = card.title === "安灯" ? C.danger : C.txt;
    makeText(cx + 12, y + 34, colW - 24, card.big || "", { size: 30, bold: true, color: bigColor, parent });
    makeText(cx + 12, y + 72, colW - 24, card.muted || "", { size: 12, color: C.muted, parent });
  });
  return cardH;
}
function renderPanel(x, y, panel, maxW, parent) {
  const pad = 12;
  const gap = 10;
  const bg = makeRect(x, y, maxW, 60, { fill: C.panelBg, stroke: C.panelBd, radius: 4, parent });
  bg.name = "面板:" + (panel.title ? panel.title.text : "");
  let cy = y + pad;
  if (panel.title && panel.title.text) {
    makeRect(x + pad, cy, 4, 18, { fill: C.primary, radius: 2, parent });
    makeText(x + pad + 10, cy - 2, maxW - pad * 2 - 10, panel.title.text, { size: 14, color: "#555555", bold: true, parent });
    cy += 26;
  }
  for (const child of panel.children || []) {
    if (child.type === "table" || ("headers" in child)) {
      const res = renderTable(x + pad, cy, child, maxW - pad * 2, parent);
      cy += res.h + gap;
    } else if (child.type === "buttons") {
      cy += renderButtons(x + pad, cy, child.items, maxW - pad * 2, parent) + gap;
    } else if (child.type === "steps") {
      cy += renderSteps(x + pad, cy, child.items, maxW - pad * 2, parent) + gap;
    } else if (child.type === "text") {
      if (!(child.text || "").trim()) continue;
      if (child.role === "h1") {
        makeText(x + pad, cy, maxW - pad * 2, child.text, { size: 18, bold: true, parent });
        cy += 30 + gap;
      } else if (child.role === "sub") {
        makeText(x + pad, cy, maxW - pad * 2, child.text, { size: 12, color: C.sub, parent });
        cy += 22 + gap;
      } else if (child.role === "muted") {
        makeText(x + pad, cy, maxW - pad * 2, child.text, { size: 12, color: C.muted, parent });
        cy += 22 + gap;
      } else {
        if (/\[输入:/.test(child.text)) {
          cy += renderRichText(x + pad, cy, child.text, 13, C.txt, 8, parent).h + gap;
        } else {
          makeText(x + pad, cy, maxW - pad * 2, child.text, { size: 13, parent });
          cy += 24 + gap;
        }
      }
    }
  }
  const totalH = cy - y + pad;
  bg.resize(maxW, totalH);
  return totalH;
}
function renderTopbar(frame, pageId) {
  makeRect(0, 0, PAGE_W, TOPBAR_H, { fill: C.topbar, parent: frame });
  makeText(16, 14, 130, "MES 低保真原型", { size: 13, bold: true, color: "#ffffff", parent: frame });
  let cx = 150;
  NAV.forEach((n) => {
    const w = Math.round(tw(n.label, 13)) + 20;
    const isActive = n.id === pageId;
    if (isActive) makeRect(cx, 6, w, 32, { fill: C.topActive, radius: 4, parent: frame });
    const link = makeText(cx + 10, 15, w - 20, n.label, { size: 13, color: isActive ? "#ffffff" : C.topLink, align: "CENTER", parent: frame });
    link.name = "导航:" + n.label;
    cx += w + 4;
  });
  makeText(PAGE_W - 380, 15, 360, "低保真线框 · 供 Axure 底图 / 演示 · 1280×800 截屏", { size: 12, color: "#8aa", parent: frame });
}

// ---------- 登录页 ----------
async function renderLogin(frame, frames) {
  const cx = PAGE_W / 2;
  let y = 120;
  makeText(cx - 200, y, 400, "MES 制造执行系统", { size: 18, bold: true, align: "CENTER", parent: frame });
  y += 34;
  makeText(cx - 200, y, 400, "演示原型 v0.1 · 汽车零部件模具制造", { size: 12, color: C.sub, align: "CENTER", parent: frame });
  y += 46;
  const cardW = 360, cardH = 150;
  const cardX = cx - cardW / 2;
  const card = makeRect(cardX, y, cardW, cardH, { fill: "#ffffff", stroke: "#999999", radius: 4, parent: frame });
  card.name = "登录卡片";
  makeText(cardX + 24, y + 22, 60, "用户名", { size: 13, parent: frame });
  makeRect(cardX + 92, y + 16, 240, 28, { fill: "#ffffff", stroke: "#999999", radius: 3, parent: frame });
  makeText(cardX + 100, y + 21, 220, "如 admin / planner", { size: 12, color: "#999999", parent: frame });
  makeText(cardX + 24, y + 64, 60, "密　码", { size: 13, parent: frame });
  makeRect(cardX + 92, y + 58, 240, 28, { fill: "#ffffff", stroke: "#999999", radius: 3, parent: frame });
  makeText(cardX + 100, y + 63, 220, "••••••", { size: 12, color: "#999999", parent: frame });
  const btnX = cardX + cardW / 2 - 100;
  const btn = makeRect(btnX, y + 104, 200, 32, { fill: C.primary, stroke: C.primaryBd, radius: 4, parent: frame });
  btn.name = "按钮:登录";
  makeText(btnX + 4, y + 108, 192, "登　录", { size: 13, color: "#ffffff", align: "CENTER", parent: frame });
  await addNav(btn, frames.shopfloor);
  y += cardH + 36;
  makeText(cx - 400, y, 800, "演示账号：admin（管理员）/ planner（计划科）/ director（车间主任）/ proj01（项目科）/ design01（设计科）/ prog01（编程科）/ wh01（仓库科）/ op01-op05（操作工）/ quality（质量科）", { size: 12, color: C.muted, align: "CENTER", parent: frame });
  y += 22;
  makeText(cx - 400, y, 800, "交互：登录后按角色跳转对应首页；密码错误提示", { size: 12, color: C.muted, align: "CENTER", parent: frame });
}

// ---------- 交互 ----------
async function addNav(node, targetFrame) {
  if (!targetFrame) return;
  try {
    await node.setReactionsAsync([{
      trigger: { type: "ON_CLICK" },
      actions: [{
        type: "NODE",
        destinationId: targetFrame.id,
        navigation: "NAVIGATE",
        transition: { type: "DISSOLVE", duration: 200, easing: "EASE_OUT" },
      }],
    }]);
  } catch (e) {
    try {
      node.reactions = [{
        trigger: { type: "ON_CLICK" },
        actions: [{
          type: "NODE",
          destinationId: targetFrame.id,
          navigation: "NAVIGATE",
          transition: { type: "DISSOLVE", duration: 200, easing: "EASE_OUT" },
        }],
      }];
    } catch (e2) { /* 忽略 */ }
  }
}

// ---------- 页面渲染 ----------
async function renderPage(page, frames) {
  const frame = frames[page.id];
  renderTopbar(frame, page.id);
  if (page.id === "login") {
    await renderLogin(frame, frames);
    await wireNavLinks(frame, frames);
    return;
  }
  let y = TOPBAR_H + 14;
  const padX = 18;
  const maxW = PAGE_W - padX * 2;
  for (const block of page.blocks) {
    if (block.type === "topbar") continue;
    if (block.type === "panel") {
      y += renderPanel(padX, y, block, maxW, frame) + 12;
    } else if (block.type === "h1") {
      makeText(padX, y, maxW, block.text || "", { size: 18, bold: true, parent: frame });
      y += 30;
    } else if (block.type === "sub") {
      makeText(padX, y, maxW, block.text || "", { size: 12, color: C.sub, parent: frame });
      y += 24;
    } else if (block.type === "muted") {
      makeText(padX, y, maxW, block.text || "", { size: 12, color: C.muted, parent: frame });
      y += 22;
    } else if (block.type === "text") {
      if (/\[输入:/.test(block.text || "")) {
        y += renderRichText(padX, y, block.text, 13, C.txt, 8, frame).h + 8;
      } else {
        makeText(padX, y, maxW, block.text || "", { size: 13, parent: frame });
        y += 26;
      }
    } else if (block.type === "buttons") {
      y += renderButtons(padX, y, block.items, maxW, frame) + 10;
    } else if (block.type === "board") {
      y += renderBoard(padX, y, block, maxW, frame) + 12;
    } else if (block.type === "steps") {
      y += renderSteps(padX, y, block.items, maxW, frame) + 12;
    } else if ("headers" in block) {
      y += renderTable(padX, y, block, maxW, frame).h + 12;
    }
  }
  await wireNavLinks(frame, frames);
}

async function wireNavLinks(frame, frames) {
  const links = frame.findAll(n => n.type === "TEXT" && n.name && n.name.startsWith("导航:"));
  for (const link of links) {
    const label = link.name.replace("导航:", "");
    const target = NAV.find(n => n.label === label);
    if (target) await addNav(link, frames[target.id]);
  }
}

// ---------- 字体 ----------
async function setupFonts() {
  let available = [];
  try { available = await figma.listAvailableFontsAsync(); } catch (e) { /* ignore */ }
  const pick = (wantBold) => {
    for (const cand of FONT_CANDIDATES) {
      const f = available.find(x => x.fontName.family === cand && (wantBold ? x.fontName.style !== "Regular" : x.fontName.style === "Regular"));
      if (f) return f.fontName;
    }
    for (const cand of FONT_CANDIDATES) {
      const f = available.find(x => x.fontName.family === cand);
      if (f) return f.fontName;
    }
    return { family: "Arial", style: wantBold ? "Bold" : "Regular" };
  };
  const reg = pick(false);
  await figma.loadFontAsync(reg);
  FONT = reg;
  let bold = null;
  try {
    bold = pick(true);
    if (bold.family !== reg.family || bold.style !== reg.style) {
      await figma.loadFontAsync(bold);
      FONT_BOLD = bold;
    } else {
      FONT_BOLD = reg;
    }
  } catch (e) {
    FONT_BOLD = reg;
  }
}

// ---------- 主流程 ----------
async function main() {
  await setupFonts();
  const canvas = figma.currentPage;
  canvas.name = "MES 低保真原型";
  for (const n of [...canvas.children]) n.remove();
  const frames = {};
  let x = 16;
  const order = ["login", "shopfloor", "scheduling", "review", "board", "trace", "wo", "project"];
  for (const page of MES_DATA.pages) {
    const f = figma.createFrame();
    const idx = order.indexOf(page.id);
    f.name = (idx >= 0 ? String(idx).padStart(2, "0") + " " : "") + page.name;
    f.resize(PAGE_W, PAGE_H);
    f.x = x; f.y = 16;
    f.fills = [{ type: "SOLID", color: hex(C.pageBg) }];
    f.strokes = [{ type: "SOLID", color: hex("#bbbbbb") }];
    f.strokeWeight = 1;
    canvas.appendChild(f);
    frames[page.id] = f;
    x += PAGE_W + 24;
  }
  for (const page of MES_DATA.pages) {
    await renderPage(page, frames);
  }
  if (frames.login) {
    frames.login.x = 16;
    figma.currentPage.selection = [frames.login];
  }
  figma.notify("✅ MES 低保真原型已生成：8 页面 + 导航交互（原型模式预览）");
  figma.closePlugin();
}
main();
