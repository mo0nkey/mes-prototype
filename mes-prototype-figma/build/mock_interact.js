// JXA mock：验证 code.js 的交互（reactions）是否真实挂载、目标是否正确
ObjC.import("Foundation");

var nodeSeq = 0;
var allNodes = [];
var reactionCalls = [];   // {node, destId}

function makeNode(type) {
  nodeSeq++;
  var id = "node:" + nodeSeq;
  var n = {
    type: type, id: id, name: "",
    x: 0, y: 0, width: 100, height: 100,
    fills: [], strokes: [], strokeWeight: 1, strokeAlign: "INSIDE",
    cornerRadius: 0, dashPattern: [], strokeCap: "NONE",
    characters: "", fontSize: 13, fontName: { family: "", style: "" },
    textAlignHorizontal: "LEFT", textAutoResize: "NONE",
    children: [],
    resize: function (w, h) { this.width = w; this.height = h; },
    appendChild: function (child) { this.children.push(child); },
    findAll: function (fn) {
      var out = [];
      var stack = this.children.slice();
      while (stack.length) {
        var cur = stack.pop();
        if (fn(cur)) out.push(cur);
        if (cur.children) stack = stack.concat(cur.children);
      }
      return out;
    },
    remove: function () {},
    setReactionsAsync: function (reactions) {
      var r = reactions && reactions[0];
      var a = r && r.actions && r.actions[0];
      reactionCalls.push({ node: this.name || this.characters, destId: a ? a.destinationId : null, nav: a ? a.navigation : null, trig: r ? r.trigger.type : null });
      return Promise.resolve();
    },
  };
  allNodes.push(n);
  return n;
}
var created = { frame: 0, rect: 0, text: 0 };
var page = { name: "", children: [], _sel: [],
  set selection(v) { this._sel = v; }, get selection() { return this._sel; },
  appendChild: function (n) { this.children.push(n); } };
var figma = {
  createFrame: function () { created.frame++; return makeNode("FRAME"); },
  createRectangle: function () { created.rect++; return makeNode("RECTANGLE"); },
  createText: function () { created.text++; return makeNode("TEXT"); },
  listAvailableFontsAsync: function () { return Promise.resolve([{ fontName: { family: "PingFang SC", style: "Regular" } }]); },
  loadFontAsync: function () { return Promise.resolve(); },
  get currentPage() { return page; },
  notify: function (m) { console.log("NOTIFY: " + m); },
  closePlugin: function () { console.log("CLOSE"); },
};

var path = "/Users/zhangmengkai/.reasonix/global-workspace/mes-prototype-figma/code.js";
var src = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null).js;
src = src.replace("main();", "main().then(function(){ console.log('MAIN OK'); checkInteractions(); }, function(e){ console.log('MAIN ERR: ' + e.message); });");

function checkInteractions() {
  console.log("reaction calls: " + reactionCalls.length);
  var ok = true;
  if (reactionCalls.length !== 65) { console.log("FAIL: 期望 65 次 reactions，实际 " + reactionCalls.length); ok = false; }
  for (var j = 0; j < reactionCalls.length; j++) {
    var c = reactionCalls[j];
    var nodeName = c.node, dest = c.destId, trig = c.trig, nav = c.nav;
    // frame 名形如 "00 登录"，用页面中文名匹配
    var expectKw = null;
    if (nodeName.indexOf("导航:") === 0) expectKw = nodeName.replace("导航:", "");
    else if (nodeName === "按钮:登录") expectKw = "工位执行端";
    if (!expectKw) { console.log("FAIL: 未知节点 " + nodeName); ok = false; continue; }
    var expectId = null;
    for (var k = 0; k < page.children.length; k++) {
      if (page.children[k].name.indexOf(expectKw) >= 0) expectId = page.children[k].id;
    }
    if (dest !== expectId) { console.log("FAIL: " + nodeName + " 目标 " + dest + " ≠ 期望 " + expectId + "（" + expectKw + "）"); ok = false; }
    if (trig !== "ON_CLICK" || nav !== "NAVIGATE") { console.log("FAIL: " + nodeName + " trigger/nav 异常 " + trig + "/" + nav); ok = false; }
  }
  console.log(ok ? "INTERACTIONS ALL OK (65 reactions, 目标与触发全部正确)" : "INTERACTIONS HAS FAILURES");
}

var errors = [];
try { eval(src); } catch (e) { errors.push("EVAL ERROR: " + e); }
delay(3);
if (errors.length) console.log("ERRORS: " + errors.join(" | "));
