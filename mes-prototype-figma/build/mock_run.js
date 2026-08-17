// JXA 环境 mock Figma API 并执行 code.js，验证运行时不报错
ObjC.import("Foundation");

function makeNode(type) {
  return {
    type: type,
    name: "",
    x: 0, y: 0, width: 100, height: 100,
    fills: [], strokes: [], strokeWeight: 1, strokeAlign: "INSIDE",
    cornerRadius: 0, dashPattern: [], strokeCap: "NONE",
    characters: "", fontSize: 13, fontName: { family: "", style: "" },
    textAlignHorizontal: "LEFT", textAutoResize: "NONE",
    resize: function (w, h) { this.width = w; this.height = h; },
    appendChild: function () {},
    findAll: function () { return []; },
    remove: function () {},
    setReactionsAsync: function () { return Promise.resolve(); },
  };
}
var created = { frame: 0, rect: 0, text: 0 };
var page = {
  name: "", children: [],
  _sel: [],
  set selection(v) { this._sel = v; },
  get selection() { return this._sel; },
};
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
page.appendChild = function (n) { this.children.push(n); };

var path = "/Users/zhangmengkai/.reasonix/global-workspace/mes-prototype-figma/code.js";
var src = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null).js;
// 把末尾 main() 替换为可捕获的调用
src = src.replace("main();", "main().then(function(){ console.log('MAIN OK'); console.log('created: ' + JSON.stringify(created)); console.log('pages: ' + page.children.length); for (var i=0;i<page.children.length;i++){ console.log('  ' + page.children[i].name + ' ' + page.children[i].width + 'x' + page.children[i].height); } }, function(e){ console.log('MAIN ERR name=' + e.name + ' msg=' + JSON.stringify(e.message) + ' | stack=' + String(e.stack).split(String.fromCharCode(10))[0]); });");
var errors = [];
try {
  eval(src);
} catch (e) {
  errors.push("EVAL ERROR: " + e);
}
// 等 async main 跑完
delay(3);
console.log("created nodes: " + JSON.stringify(created));
console.log("pages on canvas: " + page.children.length);
for (var i = 0; i < page.children.length; i++) {
  console.log("  frame " + i + ": " + page.children[i].name + " " + page.children[i].width + "x" + page.children[i].height);
}
if (errors.length) { console.log("ERRORS: " + errors.join(" | ")); }
