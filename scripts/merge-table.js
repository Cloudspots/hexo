'use strict'

/*
 * Hexo markdown-it 表格合并 + 表格 class
 *
 * 语法：
 *   <   与左侧单元格合并
 *   ^   与上方单元格合并
 *   \<  字面 <（\^ 同理）
 *
 * 表格 class 声明（作用于紧随其后的表格，中间只能有空行）：
 *   ::cute-table{tuack}
 *   :::cute-table{tuack compact}
 *   （':' 数量 >= 2 均可）
 *
 * 注意：hexo-renderer-markdown-it 每次渲染都会执行本文件注册的
 * 'markdown-it:renderer' filter，而 markdown-it 的 Ruler 不去重，
 * 重复注册会让同一规则在一个 parse 里跑 N 次（class 被追加 N 遍）。
 * 因此用 md.__mergeTableReady 保证只注册一次。
 */

/* 当前渲染的源文件，用于报错定位 */
let currentSource = null

hexo.extend.filter.register('before_post_render', function (data) {
  currentSource = (data && (data.source || data.path)) || null
  return data
})

hexo.extend.filter.register('markdown-it:renderer', function (md) {
  if (md.__mergeTableReady) return
  md.__mergeTableReady = true

  const LEFT = '\uE000HEXOMERGELEFT\uE001'
  const UP = '\uE000HEXOMERGEUP\uE001'
  const PROTECT_RE = /(^|\|)([ \t]*)(<|\^)([ \t]*)(?=\||$)/g
  const CLASS_RE = /^[A-Za-z_][A-Za-z0-9_-]*$/
  const DECL_RE = /^\s*:{2,}cute-table\s*\{([^}]*)\}\s*$/

  /* 当前 markdown 原文；cute-table 声明行在删除前先保存到这里 */
  let currentMd = ''
  let classDecls = [] // { line, className }

  /* ---------------- 错误定位 ---------------- */

  function fmtErr(token, msg) {
    let loc = currentSource || ''
    if (token && token.map && token.length) {
      if (loc) loc += '：'
      loc += `第 ${token.map[0] + 1} 行`
    }
    return `[markdown-it-merge-table] ${loc ? loc + '：' : ''}${msg}`
  }

  function fail(cell, msg) {
    throw new Error(fmtErr(cell && cell.open, msg))
  }

  /* ---------------- 保护 <、^，提取 cute-table 声明 ---------------- */

  function protectSource(src) {
    return src.split('\n').map(function (line, ln) {
      const m = line.match(DECL_RE)
      if (m) {
        const classes = m[1].trim().split(/\s+/)
        if (!classes[0]) throw new Error(fmtErr(null, 'cute-table 的 class 不能为空'))
        for (const name of classes) {
          if (!CLASS_RE.test(name)) throw new Error(fmtErr(null, `cute-table 的 class 名无效：${name}`))
        }
        classDecls.push({ line: ln, className: classes.join(' ') })
        return '' // 保留行号
      }
      /* 只保护表格行（以 | 开头）：避免正文/行内代码里的 | < | 被替换成标记 */
      if (!/^\s*\|/.test(line)) return line
      return line.replace(PROTECT_RE, (all, before, ls, marker, rs) =>
        before + ls + (marker === '<' ? LEFT : UP) + rs)
    }).join('\n')
  }

  /* ---------------- 取表格对应的 class（最近且之间只能有空行） ---------------- */

  function getTableClass(tableStartLine) {
    if (tableStartLine == null) return null
    const lines = currentMd.split('\n')
    let best = null
    for (const d of classDecls) {
      if (d.line >= tableStartLine) continue
      let ok = true
      for (let l = d.line + 1; l < tableStartLine; l++) {
        if (lines[l].trim() !== '') { ok = false; break }
      }
      if (ok && (!best || d.line > best.line)) best = d
    }
    return best ? best.className : null
  }

  /* ---------------- 处理所有表格 ---------------- */

  function processTables(tokens) {
    let i = 0
    while (i < tokens.length) {
      if (tokens[i].type !== 'table_open') { i++; continue }
      const start = i
      let depth = 0
      let end = -1
      for (let j = i; j < tokens.length; j++) {
        if (tokens[j].type === 'table_open') depth++
        else if (tokens[j].type === 'table_close' && --depth === 0) { end = j; break }
      }
      if (end === -1) throw new Error(fmtErr(null, '无法找到 table_close'))

      const tableToken = tokens[start]
      /* 标记为真实 markdown 表格（NexT 代码高亮内部也用 <table>） */
      tableToken.attrJoin('class', 'markdown-table')

      const className = getTableClass(tableToken.map && tableToken.map[0])
      if (className) tableToken.attrJoin('class', className)

      processOneTable(tokens, start, end)
      /* processOneTable 会 splice 掉标记单元格，后面的 token 下标全部前移，
       * 不能再按旧的 end 跳转，否则会跳过下一个表格；从 start 之后继续扫描。 */
      i = start + 1
    }
  }

  /* ---------------- 合并单个表格 ---------------- */

  function processOneTable(tokens, start, end) {
    const rows = []
    let currentRow = null
    let currentCell = null

    /* 收集单元格 */
    for (let i = start + 1; i < end; i++) {
      const t = tokens[i]
      if (t.type === 'tr_open') {
        currentRow = []
        rows.push(currentRow)
      } else if (t.type === 'tr_close') {
        currentRow = null
      } else if (t.type === 'td_open' || t.type === 'th_open') {
        if (!currentRow) fail(t, '单元格不属于任何表格行')
        currentCell = {
          open: t, inline: null, close: null, marker: null,
          gridRow: rows.length - 1, gridCol: null, remove: false
        }
        currentRow.push(currentCell)
      } else if (t.type === 'inline' && currentCell) {
        currentCell.inline = t
        const c = t.content.trim()
        if (c === LEFT) currentCell.marker = '<'
        else if (c === UP) currentCell.marker = '^'
      } else if (currentCell && (t.type === 'td_close' || t.type === 'th_close')) {
        currentCell.close = t
        currentCell = null
      }
    }

    if (rows.length === 0) return

    /* 物理网格：occupancy[r][c] = 占据该位置的单元格 */
    const occ = []
    const getOcc = (r, c) => (r < 0 || c < 0 || !occ[r]) ? null : (occ[r][c] || null)
    const setOcc = (r, c, cell) => {
      if (!occ[r]) occ[r] = []
      const old = occ[r][c]
      if (old && old !== cell) fail(cell, `第 ${r + 1} 行第 ${c + 1} 列发生单元格重叠`)
      occ[r][c] = cell
    }

    /* 并查集：把要合并的单元格归入同一分量 */
    const parent = new Map()
    const key = (r, c) => r + ',' + c
    const makeSet = (cell) => {
      const k = key(cell.gridRow, cell.gridCol)
      if (!parent.has(k)) parent.set(k, k)
    }
    const find = (k) => {
      if (!parent.has(k)) return null
      let root = k
      while (parent.get(root) !== root) root = parent.get(root)
      let cur = k // 路径压缩
      while (parent.get(cur) !== cur) {
        const next = parent.get(cur)
        parent.set(cur, root)
        cur = next
      }
      return root
    }
    const union = (a, b) => {
      const ra = find(key(a.gridRow, a.gridCol))
      const rb = find(key(b.gridRow, b.gridCol))
      if (ra === null || rb === null) throw new Error(fmtErr(a.open, 'Union-Find 内部错误'))
      if (ra !== rb) parent.set(ra, rb)
    }

    /* 分配物理坐标 */
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r]
      let cursor = 0
      for (let idx = 0; idx < row.length; idx++) {
        const cell = row[idx]

        if (cell.marker === '^') {
          /* 向上找第一个被占据的列 */
          while (getOcc(r - 1, cursor) === null) {
            if (++cursor > rows.length + row.length + 100) break
          }
          const above = getOcc(r - 1, cursor)
          if (!above) fail(cell, '`^` 上方没有可以合并的单元格')
          cell.gridRow = r
          cell.gridCol = cursor
          makeSet(cell)
          union(cell, above)
          setOcc(r, cursor, above) // 物理位置仍由原单元格占据
          cell.remove = true
          cursor++
        } else {
          while (getOcc(r, cursor) !== null) cursor++
          cell.gridRow = r
          cell.gridCol = cursor
          makeSet(cell)

          if (cell.marker === '<') {
            if (cursor === 0) fail(cell, '`<` 不能出现在第一列')
            const left = getOcc(r, cursor - 1)
            if (!left) fail(cell, '`<` 左侧没有可以合并的单元格')
            union(cell, left)
            cell.remove = true
            setOcc(r, cursor, left)
            cursor++
          } else {
            setOcc(r, cursor, cell)
            cursor++
          }
        }
      }
    }

    /* 收集连通分量（合并结果） */
    const comps = new Map()
    for (let r = 0; r < occ.length; r++) {
      const row = occ[r]
      if (!row) continue
      for (let c = 0; c < row.length; c++) {
        const cell = row[c]
        if (!cell) continue
        const root = find(key(cell.gridRow, cell.gridCol))
        if (!root) continue
        let comp = comps.get(root)
        if (!comp) {
          comp = { root, cells: [], minRow: r, maxRow: r, minCol: c, maxCol: c }
          comps.set(root, comp)
        }
        if (comp.cells.indexOf(cell) === -1) comp.cells.push(cell)
        comp.minRow = Math.min(comp.minRow, r)
        comp.maxRow = Math.max(comp.maxRow, r)
        comp.minCol = Math.min(comp.minCol, c)
        comp.maxCol = Math.max(comp.maxCol, c)
      }
    }

    /* 校验每个分量都是实心矩形 */
    for (const comp of comps.values()) {
      for (let r = comp.minRow; r <= comp.maxRow; r++) {
        for (let c = comp.minCol; c <= comp.maxCol; c++) {
          const cell = getOcc(r, c)
          if (!cell) fail(comp.cells[0], `合并结果不是矩形：第 ${r + 1} 行第 ${c + 1} 列缺少单元格`)
          if (find(key(cell.gridRow, cell.gridCol)) !== comp.root) {
            fail(comp.cells[0], `合并结果发生重叠：第 ${r + 1} 行第 ${c + 1} 列属于另一个单元格`)
          }
        }
      }
    }

    /* 生成 rowspan / colspan */
    for (const comp of comps.values()) {
      const real = comp.cells.find((c) => !c.remove)
      if (!real) fail(comp.cells[0], '合并结果没有实际内容单元格')
      const rowspan = comp.maxRow - comp.minRow + 1
      const colspan = comp.maxCol - comp.minCol + 1
      if (rowspan > 1) real.open.attrSet('rowspan', String(rowspan))
      if (colspan > 1) real.open.attrSet('colspan', String(colspan))
      /* 底边到达表格底部的单元格，供 Tuack CSS 使用 */
      if (comp.maxRow === rows.length - 1) real.open.attrJoin('class', 'table-bottom-cell')
      for (const cell of comp.cells) if (cell !== real) cell.remove = true
    }

    /* 删除标记单元格的 token（倒序删，保证索引有效） */
    const removeTokens = new Set()
    for (const row of rows) {
      for (const cell of row) {
        if (!cell.remove) continue
        if (cell.open) removeTokens.add(cell.open)
        if (cell.inline) removeTokens.add(cell.inline)
        if (cell.close) removeTokens.add(cell.close)
      }
    }
    for (let i = end - 1; i > start; i--) {
      if (removeTokens.has(tokens[i])) tokens.splice(i, 1)
    }
  }

  /* ---------------- 注册规则 ---------------- */

  md.core.ruler.before('block', 'hexo-merge-table-protect', function (state) {
    /* 保存原文再改，保证 cute-table 声明行号可用于匹配 */
    currentMd = state.src
    classDecls = []
    state.src = protectSource(state.src)
  })

  md.core.ruler.after('block', 'hexo-merge-table', function (state) {
    processTables(state.tokens)
  })
})
