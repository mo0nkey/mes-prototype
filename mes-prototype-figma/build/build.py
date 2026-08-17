#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""构建：把 mes_data.json 注入 code_template.js → 最终 code.js"""
import json, os

BASE = "/Users/zhangmengkai/.reasonix/global-workspace/mes-prototype-figma"
TPL = os.path.join(BASE, "build/code_template.js")
DATA = os.path.join(BASE, "build/mes_data.json")
OUT = os.path.join(BASE, "code.js")

data = json.load(open(DATA, encoding="utf-8"))
js_data = json.dumps(data, ensure_ascii=False, separators=(",", ":"))

tpl = open(TPL, encoding="utf-8").read()
assert "const MES_DATA = null;" in tpl, "占位符缺失"
out = tpl.replace("const MES_DATA = null;", "const MES_DATA = " + js_data + ";")
open(OUT, "w", encoding="utf-8").write(out)
print("written ->", OUT, os.path.getsize(OUT), "bytes")
