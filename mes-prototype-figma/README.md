# MES 低保真原型生成器（Figma 插件）

根据你提供的 HTML 低保真原型（`clipboard-20260816-215959.486716-000001.html`，8 页面 MES 制造执行系统），在 Figma 中**自动生成可编辑、带交互**的原型。

> 配套参考：`../mes-prototype-spec.md` 是本原型的「项目实例」规格（页面清单、交互规则、状态矩阵、跳转流）；`../prototype-spec-template/` 是通用模板包（`global-design-system.md` 全局视觉规范 + `prototype-spec.md` 通用模板），给 AI 生成/评审原型时直接引用。

## 文件清单

```
mes-prototype-figma/
├── manifest.json          # 插件清单（Figma 加载入口）
├── code.js                # 插件主程序（含全部页面数据，纯 JS 无依赖）
├── README.md              # 本说明
└── build/                 # 构建与验证脚本（改 HTML 后可重新生成）
    ├── extract.py         # ① HTML → 结构化 JSON（mes_data.json）
    ├── build.py           # ② JSON 注入模板 → code.js
    ├── code_template.js   # 渲染逻辑模板
    ├── mes_data.json      # 提取出的 8 页面数据
    └── mock_run.js        # ③ JXA 运行时模拟验证（无需 Figma 即可跑）
```

## 使用步骤（约 2 分钟）

1. 打开 **Figma 桌面端**（本机已装），登录并新建/打开任意设计文件。
2. 顶部菜单 → **Plugins（插件）** → **Development（开发）** → **Import plugin from manifest…（从清单导入插件）**，选择本目录的 `manifest.json`。
3. 插件会出现在 Development 菜单下，名为「MES 低保真原型生成器」，**点击运行**。
4. 运行后自动生成 8 个页面（Frame）：
   `00 登录 → 01 工位执行端 → 02 排产工作台 → 03 审核工作台 → 04 生产看板 → 05 追溯中心 → 06 工单列表 → 07 项目台账`
5. 点右上角 **Present（演示 / ⚡ 原型模式）** 预览交互：点顶部导航栏任意链接跳转页面；登录页点「登　录」跳转工位执行端。

> 提示：插件生成的元素全部是 Figma 原生图层（矩形/文本），可直接选中修改文字、换色、拖拽调整。

## 交互范围（与 HTML 版一致）

- **顶部导航栏 8 个链接** → 点击跳转对应页面（每个页面都有）。
- **登录页「登　录」按钮** → 跳转工位执行端（HTML 中提示"登录后按角色跳转对应首页"，此处简化为固定跳转，可按需在 Figma 原型面板自行改成角色分流）。
- 其余按钮（提交确认、通过/驳回、导出 CSV 等）在 HTML 中无明确跳转目标，生成为**静态占位**，可在 Figma 原型面板里自行补充交互。

## 重新生成（改了 HTML 之后）

```bash
cd mes-prototype-figma/build
python3 extract.py   # HTML → mes_data.json
python3 build.py     # 数据注入 → code.js
osascript -l JavaScript mock_run.js   # 可选：模拟运行验证
```

## 为什么不做 Axure 直出？（探索结论）

已按你的要求探索过生成 Axure `.rp` 源文件的路径，结论如下：

- 本机 Axure RP 9（9.0.0.3723）**无任何命令行/脚本接口**，无法无头生成文件。
- `.rp` 文件是私有二进制格式：RP9 为「15 字节头 + JSON/LZ4 压缩块交错 + GUID 引用」，RP8 为 ZIP 内嵌 .NET 二进制序列化；GitHub 上**不存在现成的生成/解析工具**（曾有的 nierr/axure-rp 已删除，相关搜索 0 结果）。
- 自研生成器需要完整逆向 Axure 的对象模型（控件类型/样式/交互事件），成本高且无法可靠验证 Axure 是否能正常打开，风险大。

因此选择 **Figma 插件**方案交付（同样可编辑、带交互，且是现成主流工具）。如仍需要 Axure 版，可把生成的 Figma 原型当作底图参考，或直接以 HTML 版为底图在 Axure 中复刻；需要的话我可以再出一份「Axure 逐页搭建清单」。
