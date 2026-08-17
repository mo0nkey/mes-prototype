#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 MES 低保真原型 HTML 提取结构化数据 → JSON，供 Figma 插件渲染。
用 div 栈深度法跟踪嵌套，正确处理 step/board-card 内的 muted 子 div。"""
import json, re
from html.parser import HTMLParser

SRC = "/Users/zhangmengkai/.reasonix/global-workspace/.reasonix/attachments/clipboard-20260816-215959.486716-000001.html"
OUT = "/Users/zhangmengkai/.reasonix/global-workspace/mes-prototype-figma/build/mes_data.json"

PAGE_NAMES = {
    "login": "登录", "shopfloor": "工位执行端", "scheduling": "排产工作台",
    "review": "审核工作台", "board": "生产看板", "trace": "追溯中心",
    "wo": "工单列表", "project": "项目台账",
}

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        # 顶层块
        self.top = None          # 当前顶层块 dict
        self.top_depth = None    # 创建 top 的 div 深度
        # panel
        self.in_panel = False
        self.panel_children = None
        # table
        self.table = None
        self.row = None
        self.cell = None
        # span 目标（tag/btn/num）
        self.span_cell = None    # cell dict（span 挂到 cell）
        self.span_btn = None     # button item dict
        self.in_span = False
        self.span_num = False    # step 内的 span.num
        # panel 内普通文本框
        self.panel_text = None
        self.panel_text_depth = None
        self._h3_active = False
        # step
        self.step = None
        self.step_depth = None
        self.step_first_div = True
        self.steps_container = None  # steps 块引用（顶层或 panel 内）
        self.steps_container_depth = None
        # card
        self.card = None
        self.card_depth = None
        self.card_h4 = False
        self.card_bignum = False
        # div 深度
        self.depth = 0

    def _cls(self, attrs):
        return dict(attrs).get("class", "")

    def handle_starttag(self, tag, attrs):
        cls = self._cls(attrs)
        if tag == "div":
            self.depth += 1
            # step
            if "step" in cls.split() and self.steps_container is not None:
                self.step = {"num": "", "title": "", "extra": ""}
                self.step_depth = self.depth
                self.step_first_div = True
                self.steps_container["items"].append(self.step)
                return
            # steps 容器（顶层或 panel 内）
            if "steps" in cls.split() and self.step is None and self.card is None:
                if not self.in_panel:
                    t = {"type": "steps", "items": []}
                    self.top = t
                    self.top_depth = self.depth
                else:
                    t = {"type": "steps", "items": []}
                    self.panel_children.append(t)
                self.steps_container = t
                self.steps_container_depth = self.depth
                return
            # board-card
            if "board-card" in cls.split() and self.top and self.top.get("type") == "board":
                self.card = {"title": "", "big": "", "muted": ""}
                self.card_depth = self.depth
                self.top["cards"].append(self.card)
                return
            # 顶层块创建（不在 step/card/panel 内）
            if self.step is None and self.card is None and not self.in_panel:
                t = None
                if "panel" in cls.split():
                    t = {"type": "panel", "title": None, "children": []}
                    self.in_panel = True
                    self.panel_children = t["children"]
                elif "board-grid" in cls.split():
                    t = {"type": "board", "cards": []}
                elif "wf-topbar" in cls.split():
                    t = {"type": "topbar", "parts": [], "rights": []}
                elif "h1" in cls.split():
                    t = {"type": "h1", "text": ""}
                elif "sub" in cls.split():
                    t = {"type": "sub", "text": ""}
                elif "muted" in cls.split():
                    t = {"type": "muted", "text": ""}
                elif "wf" in cls.split():
                    t = {"type": "text", "text": ""}
                if t is not None:
                    self.top = t
                    self.top_depth = self.depth
            # panel 内 div：steps 已提前处理；h1/sub/muted → 带 role 的文本子块；其余 → 文本子块
            elif self.in_panel and self.panel_children is not None and self.step is None:
                role = None
                for k in ("h1", "sub", "muted"):
                    if k in cls.split():
                        role = k
                self.panel_text = {"type": "text", "text": ""}
                if role:
                    self.panel_text["role"] = role
                self.panel_text_depth = self.depth
                self.panel_children.append(self.panel_text)
            return
        if tag == "h3" and self.in_panel and self.top and self.top.get("type") == "panel":
            self.top["title"] = {"type": "text", "text": ""}
            self._h3_active = True
            return
        if tag == "h4" and self.card is not None:
            self.card_h4 = True
            return
        if tag == "div" and "bignum" in cls.split() and self.card is not None:
            self.card_bignum = True
            return
        if tag == "table":
            self.table = {"headers": [], "rows": []}
            if self.in_panel and self.panel_children is not None:
                self.panel_children.append(self.table)
            else:
                self.top = self.table
                self.top_depth = None  # table 非 div 块
            return
        if tag == "tr":
            self.row = []
            return
        if tag in ("th", "td"):
            self.cell = {"text": "", "span": None}
            if tag == "th":
                self.table["headers"].append(self.cell)
            else:
                self.row.append(self.cell)
            return
        if tag == "input":
            ph = dict(attrs).get("placeholder", "")
            if self.step is not None:
                self.step["extra"] = (self.step["extra"] + " [输入:" + ph + "]").strip()
            elif self.cell is not None:
                self.cell["text"] += "[输入:" + ph + "] "
            elif self.panel_text is not None:
                self.panel_text["text"] += "[输入:" + ph + "] "
            elif self.top is not None and self.top.get("type") == "text":
                self.top["text"] += "[输入:" + ph + "] "
            return
        if tag == "span" and "num" in cls.split() and self.step is not None:
            self.in_span = True
            self.span_num = True
            return
        if tag == "span" and ("tag" in cls.split() or "btn" in cls.split()):
            self.in_span = True
            if self.cell is not None:
                self.span_cell = {"cls": cls, "text": ""}
                self.cell["span"] = self.span_cell
            elif self.in_panel and self.panel_children is not None and self.step is None:
                if not self.panel_children or self.panel_children[-1].get("type") != "buttons":
                    self.panel_children.append({"type": "buttons", "items": []})
                items = self.panel_children[-1]["items"]
                self.span_btn = {"cls": cls, "text": ""}
                items.append(self.span_btn)
            elif self.top is not None and self.top.get("type") == "topbar":
                self.span_btn = {"cls": cls, "text": ""}
                self.top["rights"].append(self.span_btn)
            elif self.top is None:
                self.top = {"type": "buttons", "items": []}
                self.top_depth = None
                self.span_btn = {"cls": cls, "text": ""}
                self.top["items"].append(self.span_btn)
            elif self.top and self.top.get("type") == "buttons":
                self.span_btn = {"cls": cls, "text": ""}
                self.top["items"].append(self.span_btn)
            return

    def handle_endtag(self, tag):
        if tag == "div":
            # bignum div 结束即清标记（muted 复清无害）
            if self.card is not None and self.card_bignum:
                self.card_bignum = False
            # panel 内文本子块结束
            if self.panel_text is not None and self.depth == self.panel_text_depth:
                self.panel_text = None
                self.panel_text_depth = None
            # steps 容器结束（顶层由 top_depth 分支收尾，这里清引用）
            if self.steps_container is not None and self.depth == self.steps_container_depth:
                self.steps_container = None
                self.steps_container_depth = None
            # step 结束
            if self.step is not None and self.depth == self.step_depth:
                self.step = None
                self.step_depth = None
                self.step_first_div = True
            # card 结束
            if self.card is not None and self.depth == self.card_depth:
                self.card = None
                self.card_depth = None
            # 顶层块结束
            if self.top is not None and self.top_depth is not None and self.depth == self.top_depth:
                if self.top.get("type") == "panel":
                    self.in_panel = False
                    self.panel_children = None
                self.blocks.append(self.top)
                self.top = None
                self.top_depth = None
            self.depth -= 1
            return
        if tag == "h3":
            self._h3_active = False
            return
        if tag == "h4":
            self.card_h4 = False
            return
        if tag == "div" and self.card is not None:
            self.card_bignum = False
            return
        if tag == "table":
            self.table = None
            return
        if tag == "tr":
            if self.table is not None and self.row is not None and len(self.row) > 0:
                self.table["rows"].append(self.row)
            self.row = None
            return
        if tag in ("th", "td"):
            self.cell = None
            return
        if tag == "span":
            self.in_span = False
            self.span_cell = None
            self.span_btn = None
            self.span_num = False
            return

    def handle_data(self, data):
        s = data.strip()
        if not s:
            return
        # span 内文本
        if self.in_span:
            if self.span_cell is not None:
                self.span_cell["text"] += s
            elif self.span_btn is not None:
                self.span_btn["text"] += s
            elif self.span_num and self.step is not None:
                self.step["num"] += s
            return
        # step 内文本
        if self.step is not None:
            if self.step_first_div and not self.step["title"]:
                self.step["title"] += s
            else:
                self.step["extra"] += s
            return
        # card 内文本
        if self.card is not None:
            if self.card_h4:
                self.card["title"] += s
            elif self.card_bignum:
                self.card["big"] += s
            else:
                self.card["muted"] += s
            return
        # 单元格文本
        if self.cell is not None:
            self.cell["text"] += (" " if self.cell["text"] and self.cell["text"][-1] not in " ｜:" else "") + s
            return
        # panel 内文本子块
        if self.panel_text is not None:
            self.panel_text["text"] += s
            return
        # h3 标题
        if self.top is not None and self.top.get("type") == "panel" and getattr(self, "_h3_active", False):
            self.top["title"]["text"] += s
            return
        # 文本型顶层块
        if self.top is not None and self.top.get("type") in ("h1", "sub", "muted", "text"):
            self.top["text"] += s
            return
        # topbar
        if self.top is not None and self.top.get("type") == "topbar":
            self.top["parts"].append(s)
            return

    def handle_startspan_num(self):
        pass

    def unknown_decl(self, data):
        pass

def split_pages(html):
    pages = {}
    for m in re.finditer(r'<div class="page" id="p-([a-z]+)">(.*?)(?=<div class="page"|</body>)', html, re.S):
        pages[m.group(1)] = m.group(2)
    return pages

def _simplify_cell(c):
    if not c:
        return {"text": ""}
    span = c.get("span")
    text = (span.get("text") if span and span.get("text") else c.get("text") or "").strip()
    out = {"text": text}
    if span:
        cls = span.get("cls", "")
        if "tag" in cls:
            color = "gray"
            for k in ("green", "orange", "red"):
                if k in cls:
                    color = k
            out["tag"] = color
        if "btn" in cls:
            style = ""
            for k in ("primary", "warn", "danger"):
                if k in cls:
                    style = k
            out["btn"] = style
    return out

def simplify_tables(node):
    """递归把 table 的 cell 简化（{text, tag?, btn?}）。"""
    if "headers" in node and "rows" in node:
        node["headers"] = [_simplify_cell(h) for h in node.get("headers", [])]
        node["rows"] = [[_simplify_cell(c) for c in r] for r in node.get("rows", [])]
    elif node.get("type") == "panel":
        for c in node.get("children", []):
            simplify_tables(c)

def main():
    html = open(SRC, encoding="utf-8").read()
    raw_pages = split_pages(html)
    result = {"pages": []}
    for pid in ["login", "shopfloor", "scheduling", "review", "board", "trace", "wo", "project"]:
        body = raw_pages.get(pid, "")
        p = PageParser()
        p.feed(body)
        blocks = []
        for b in p.blocks:
            b = json.loads(json.dumps(b))
            simplify_tables(b)
            blocks.append(b)
        result["pages"].append({"id": pid, "name": PAGE_NAMES.get(pid, pid), "blocks": blocks})
        print(f"== {pid} ({PAGE_NAMES.get(pid)}) blocks={len(blocks)}")
        for b in blocks:
            t = b.get("type")
            if t == "table":
                print(f"   table: {len(b['headers'])}c x {len(b['rows'])}r | {[h['text'] for h in b['headers']][:4]}")
            elif t == "panel":
                print(f"   panel: title={b['title']['text'] if b['title'] else ''} children={len(b.get('children', []))}")
            elif t == "buttons":
                print(f"   buttons: {[i['text'] for i in b.get('items', [])]}")
            elif t == "steps":
                print(f"   steps: {len(b.get('items', []))} -> {[(i['num'], i['title']) for i in b.get('items', [])]}")
            elif t == "board":
                print(f"   board cards: {len(b.get('cards', []))} -> {[c['title'] for c in b.get('cards', [])]}")
            else:
                print(f"   {t}: {str(b.get('text', ''))[:60]}")
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    print(f"\nwritten -> {OUT}")

if __name__ == "__main__":
    main()
