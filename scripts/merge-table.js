'use strict'

/*
 * ============================================================
 * Hexo Markdown-it Table Merge + Table Class
 * ============================================================
 *
 * Table merge syntax:
 *
 *   <   merge with the cell on the left
 *   ^   merge with the cell above
 *
 * Escaped:
 *
 *   \<  -> literal <
 *   \^  -> literal ^
 *
 *
 * Table class syntax:
 *
 *   ::cute-table{tuack}
 *   :::cute-table{tuack}
 *   ::::cute-table{tuack compact}
 *
 * Any number of ':' >= 2 is accepted.
 *
 * The declaration applies only to the immediately following
 * Markdown table. Blank lines are allowed in between.
 *
 * Example:
 *
 *   ::cute-table{tuack}
 *
 *   | a | b | c |
 *   |---|---|---|
 *   | 1 | 2 | 3 |
 *
 * becomes:
 *
 *   <table class="tuack">
 *
 * ============================================================
 */


/* ============================================================
 * Hexo: remember the source file currently being rendered.
 * ============================================================
 */

let currentSource = null

hexo.extend.filter.register(
  'before_post_render',
  function (data) {
    if (
      data &&
      typeof data.source === 'string'
    ) {
      currentSource = data.source
    } else if (
      data &&
      typeof data.path === 'string'
    ) {
      currentSource = data.path
    } else {
      currentSource = null
    }

    return data
  }
)


/* ============================================================
 * Markdown-it extension
 * ============================================================
 */

hexo.extend.filter.register(
  'markdown-it:renderer',
  function (md) {
    const LEFT_MARKER =
      '\uE000HEXOMERGELEFT\uE001'

    const UP_MARKER =
      '\uE000HEXOMERGEUP\uE001'


    /*
     * Table class declarations.
     *
     * Example:
     *
     *   ::cute-table{tuack compact}
     *
     * becomes:
     *
     *   {
     *     line: 10,
     *     className: 'tuack compact'
     *   }
     */
    let tableClassDeclarations = []


    /*
     * The Markdown source currently being parsed.
     *
     * This is deliberately kept separately from currentSource.
     *
     * currentSource:
     *   filename / source path
     *
     * currentMarkdownSource:
     *   actual Markdown text currently being parsed
     */
    let currentMarkdownSource = ''


    /* --------------------------------------------------------
     * STEP 1
     *
     * Protect:
     *
     *   <
     *   ^
     *
     * and detect:
     *
     *   ::cute-table{...}
     *
     * before Markdown-it parses the tables.
     * --------------------------------------------------------
     */

    md.core.ruler.before(
      'block',
      'hexo-merge-table-protect',
      function (state) {
        /*
         * Save the current Markdown source BEFORE modifying it.
         *
         * This is important because cute-table declarations are
         * removed from state.src below.
         */
        currentMarkdownSource =
          state.src

        tableClassDeclarations = []

        state.src =
          protectSource(
            state.src
          )
      }
    )


    /* --------------------------------------------------------
     * STEP 2
     *
     * Process table tokens after block parsing.
     * --------------------------------------------------------
     */

    md.core.ruler.after(
      'block',
      'hexo-merge-table',
      function (state) {
        processTables(
          state.tokens
        )
      }
    )


    /* ========================================================
     * Protect source
     *
     * Detect:
     *
     *   ::cute-table{tuack}
     *
     * and remove that line from Markdown-it input.
     *
     * The line is replaced with an empty line, so all following
     * source line numbers remain unchanged.
     * ========================================================
     */

    function protectSource(source) {
      return source
        .split('\n')
        .map(function (
          line,
          lineNumber
        ) {
          /* --------------------------------------------------
           * cute-table declaration
           *
           * >= 2 ':' are accepted.
           *
           * Examples:
           *
           *   ::cute-table{tuack}
           *   :::cute-table{tuack}
           *   ::::cute-table{tuack compact}
           * --------------------------------------------------
           */

          const classMatch =
            line.match(
              /^\s*:{2,}cute-table\s*\{([^}]*)\}\s*$/
            )

          if (classMatch) {
            const className =
              classMatch[1].trim()

            if (!className) {
              throw new Error(
                formatError(
                  null,
                  'cute-table 的 class 不能为空'
                )
              )
            }

            const classes =
              className.split(/\s+/)

            /*
             * Validate every class name.
             */
            for (
              const name of classes
            ) {
              if (
                !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(
                  name
                )
              ) {
                throw new Error(
                  formatError(
                    null,
                    `cute-table 的 class 名无效：${name}`
                  )
                )
              }
            }

            tableClassDeclarations.push({
              line: lineNumber,
              className:
                classes.join(' ')
            })

            /*
             * Remove declaration but preserve
             * the source line number.
             */
            return ''
          }


          /* --------------------------------------------------
           * Protect < and ^
           * --------------------------------------------------
           */

          return line.replace(
            /(^|\|)([ \t]*)(<|\^)([ \t]*)(?=\||$)/g,
            function (
              match,
              before,
              leftSpace,
              marker,
              rightSpace
            ) {
              const replacement =
                marker === '<'
                  ? LEFT_MARKER
                  : UP_MARKER

              return (
                before +
                leftSpace +
                replacement +
                rightSpace
              )
            }
          )
        })
        .join('\n')
    }


    /* ========================================================
     * Get class declaration belonging to a table.
     *
     * The declaration must:
     *
     *   1. appear before the table
     *   2. have only blank lines between it and the table
     *
     * The nearest matching declaration wins.
     * ========================================================
     */

    function getTableClass(
      tableStartLine
    ) {
      if (
        tableStartLine === null ||
        tableStartLine === undefined
      ) {
        return null
      }

      const lines =
        currentMarkdownSource.split('\n')

      let best = null

      for (
        const declaration of
          tableClassDeclarations
      ) {
        if (
          declaration.line >=
          tableStartLine
        ) {
          continue
        }

        let valid = true

        /*
         * Everything between the declaration and table
         * must be blank.
         */
        for (
          let line =
            declaration.line + 1;
          line < tableStartLine;
          line++
        ) {
          if (
            lines[line].trim() !== ''
          ) {
            valid = false
            break
          }
        }

        if (!valid) {
          continue
        }

        if (
          !best ||
          declaration.line >
            best.line
        ) {
          best = declaration
        }
      }

      return best
        ? best.className
        : null
    }


    /* ========================================================
     * Find and process every table.
     * ========================================================
     */

    function processTables(tokens) {
      let i = 0

      while (
        i < tokens.length
      ) {
        if (
          tokens[i].type !==
          'table_open'
        ) {
          i++
          continue
        }

        const start = i

        let depth = 0
        let end = -1

        for (
          let j = i;
          j < tokens.length;
          j++
        ) {
          if (
            tokens[j].type ===
            'table_open'
          ) {
            depth++
          }

          if (
            tokens[j].type ===
            'table_close'
          ) {
            depth--

            if (
              depth === 0
            ) {
              end = j
              break
            }
          }
        }

        if (
          end === -1
        ) {
          throw new Error(
            formatError(
              null,
              '无法找到 table_close'
            )
          )
        }


        /* ----------------------------------------------------
         * Apply cute-table class
         * ----------------------------------------------------
         */

const tableToken =
  tokens[start]

/*
 * Mark this as a real Markdown table.
 *
 * This is important because Next's code highlight
 * also uses <table> internally for line numbers.
 */
tableToken.attrJoin(
  'class',
  'markdown-table'
)

let tableStartLine = null
        if (
          tableToken.map &&
          tableToken.map.length > 0
        ) {
          /*
           * token.map[0] is zero-based.
           */
          tableStartLine =
            tableToken.map[0]
        }

        const className =
          getTableClass(
            tableStartLine
          )

        if (className) {
          tableToken.attrJoin(
            'class',
            className
          )
        }


        /*
         * Existing merge-table functionality.
         */
        processOneTable(
          tokens,
          start,
          end
        )

        i = end + 1
      }
    }


    /* ========================================================
     * Parse one table.
     * ========================================================
     */

    function processOneTable(
      tokens,
      start,
      end
    ) {
      const rows = []

      let currentRow = null
      let currentCell = null


      for (
        let i = start + 1;
        i < end;
        i++
      ) {
        const token =
          tokens[i]


        /* ----------------------------------------------------
         * <tr>
         * ----------------------------------------------------
         */

        if (
          token.type === 'tr_open'
        ) {
          currentRow = []
          rows.push(
            currentRow
          )

          continue
        }


        /* ----------------------------------------------------
         * </tr>
         * ----------------------------------------------------
         */

        if (
          token.type === 'tr_close'
        ) {
          currentRow = null

          continue
        }


        /* ----------------------------------------------------
         * <td> / <th>
         * ----------------------------------------------------
         */

        if (
          token.type === 'td_open' ||
          token.type === 'th_open'
        ) {
          if (!currentRow) {
            throw new Error(
              formatError(
                token,
                '单元格不属于任何表格行'
              )
            )
          }

          currentCell = {
            open: token,
            inline: null,
            close: null,

            marker: null,

            /*
             * Source position in Markdown row.
             */
            sourceRow:
              rows.length - 1,

            sourceCol:
              currentRow.length,

            /*
             * Physical grid position.
             */
            gridRow:
              rows.length - 1,

            gridCol: null,

            /*
             * Whether this source cell disappears
             * from the final HTML.
             */
            remove: false
          }

          currentRow.push(
            currentCell
          )

          continue
        }


        /* ----------------------------------------------------
         * Cell content
         * ----------------------------------------------------
         */

        if (
          token.type === 'inline' &&
          currentCell
        ) {
          currentCell.inline =
            token

          const content =
            token.content.trim()

          if (
            content === LEFT_MARKER
          ) {
            currentCell.marker = '<'
          } else if (
            content === UP_MARKER
          ) {
            currentCell.marker = '^'
          }

          continue
        }


        /* ----------------------------------------------------
         * </td> / </th>
         * ----------------------------------------------------
         */

        if (
          currentCell &&
          (
            token.type ===
              'td_close' ||
            token.type ===
              'th_close'
          )
        ) {
          currentCell.close =
            token

          currentCell = null
        }
      }


      if (
        rows.length === 0
      ) {
        return
      }


      /* ======================================================
       * Physical table grid
       *
       * occupancy[r][c]
       *
       * = actual cell occupying physical position (r,c)
       * ======================================================
       */

      const occupancy = []


      function ensureRow(row) {
        if (!occupancy[row]) {
          occupancy[row] = []
        }
      }


      function getOccupied(
        row,
        col
      ) {
        if (
          row < 0 ||
          col < 0
        ) {
          return null
        }

        if (
          !occupancy[row]
        ) {
          return null
        }

        return (
          occupancy[row][col] ||
          null
        )
      }


      function setOccupied(
        row,
        col,
        cell
      ) {
        ensureRow(row)

        const old =
          occupancy[row][col]

        if (
          old &&
          old !== cell
        ) {
          throwTableError(
            cell,
            `第 ${row + 1} 行第 ${col + 1} 列发生单元格重叠`
          )
        }

        occupancy[row][col] =
          cell
      }


      /* ======================================================
       * Union-Find
       * ======================================================
       */

      const parent = new Map()


      function makeKey(
        row,
        col
      ) {
        return (
          row +
          ',' +
          col
        )
      }


      function makeSet(cell) {
        const key =
          makeKey(
            cell.gridRow,
            cell.gridCol
          )

        if (
          !parent.has(key)
        ) {
          parent.set(
            key,
            key
          )
        }
      }


      function find(key) {
        if (
          !parent.has(key)
        ) {
          return null
        }

        let root = key

        while (
          parent.get(root) !==
          root
        ) {
          root =
            parent.get(root)
        }

        /*
         * Path compression.
         */
        let current = key

        while (
          parent.get(current) !==
          current
        ) {
          const next =
            parent.get(current)

          parent.set(
            current,
            root
          )

          current = next
        }

        return root
      }


      function union(
        a,
        b
      ) {
        const ka =
          makeKey(
            a.gridRow,
            a.gridCol
          )

        const kb =
          makeKey(
            b.gridRow,
            b.gridCol
          )

        const ra = find(ka)
        const rb = find(kb)

        if (
          ra === null ||
          rb === null
        ) {
          throw new Error(
            formatError(
              a.open,
              'Union-Find 内部错误'
            )
          )
        }

        if (
          ra !== rb
        ) {
          parent.set(
            ra,
            rb
          )
        }
      }


      /* ======================================================
       * Assign physical grid positions.
       * ======================================================
       */

      const rowCursors = []


      for (
        let r = 0;
        r < rows.length;
        r++
      ) {
        const row = rows[r]

        let cursor = 0

        rowCursors[r] = 0


        for (
          let index = 0;
          index < row.length;
          index++
        ) {
          const cell =
            row[index]

          const marker =
            cell.marker


          /* --------------------------------------------------
           * ^
           * --------------------------------------------------
           */

          if (
            marker === '^'
          ) {
            while (
              getOccupied(
                r - 1,
                cursor
              ) === null
            ) {
              cursor++

              if (
                cursor >
                rows.length +
                row.length +
                100
              ) {
                break
              }
            }

            const above =
              getOccupied(
                r - 1,
                cursor
              )

            if (!above) {
              throwTableError(
                cell,
                '`^` 上方没有可以合并的单元格'
              )
            }

            cell.gridRow = r
            cell.gridCol = cursor

            makeSet(cell)

            union(
              cell,
              above
            )

            /*
             * Physical position remains occupied by
             * the merged cell.
             */
            setOccupied(
              r,
              cursor,
              above
            )

            cell.remove = true

            cursor++

            continue
          }


          /* --------------------------------------------------
           * Ordinary / <
           * --------------------------------------------------
           */

          while (
            getOccupied(
              r,
              cursor
            ) !== null
          ) {
            cursor++
          }

          cell.gridRow = r
          cell.gridCol = cursor

          makeSet(cell)


          /* --------------------------------------------------
           * <
           * --------------------------------------------------
           */

          if (
            marker === '<'
          ) {
            if (
              cursor === 0
            ) {
              throwTableError(
                cell,
                '`<` 不能出现在第一列'
              )
            }

            const left =
              getOccupied(
                r,
                cursor - 1
              )

            if (!left) {
              throwTableError(
                cell,
                '`<` 左侧没有可以合并的单元格'
              )
            }

            union(
              cell,
              left
            )

            cell.remove = true

            setOccupied(
              r,
              cursor,
              left
            )

            cursor++

            continue
          }


          /* --------------------------------------------------
           * Ordinary cell
           * --------------------------------------------------
           */

          setOccupied(
            r,
            cursor,
            cell
          )

          cursor++
        }
      }


      /* ======================================================
       * Components
       * ======================================================
       */

      const components =
        new Map()


      for (
        let r = 0;
        r < occupancy.length;
        r++
      ) {
        const row =
          occupancy[r]

        if (!row) {
          continue
        }

        for (
          let c = 0;
          c < row.length;
          c++
        ) {
          const cell =
            row[c]

          if (!cell) {
            continue
          }

          const root =
            find(
              makeKey(
                cell.gridRow,
                cell.gridCol
              )
            )

          if (!root) {
            continue
          }

          let component =
            components.get(root)

          if (!component) {
            component = {
              root: root,

              cells: [],

              minRow: r,
              maxRow: r,

              minCol: c,
              maxCol: c
            }

            components.set(
              root,
              component
            )
          }

          if (
            component.cells.indexOf(
              cell
            ) === -1
          ) {
            component.cells.push(
              cell
            )
          }

          component.minRow =
            Math.min(
              component.minRow,
              r
            )

          component.maxRow =
            Math.max(
              component.maxRow,
              r
            )

          component.minCol =
            Math.min(
              component.minCol,
              c
            )

          component.maxCol =
            Math.max(
              component.maxCol,
              c
            )
        }
      }


      /* ======================================================
       * Validate that every component is a rectangle.
       * ======================================================
       */

      for (
        const component of
          components.values()
      ) {
        for (
          let r =
            component.minRow;
          r <= component.maxRow;
          r++
        ) {
          for (
            let c =
              component.minCol;
            c <= component.maxCol;
            c++
          ) {
            const cell =
              getOccupied(
                r,
                c
              )

            if (!cell) {
              throwTableError(
                component.cells[0],
                `合并结果不是矩形：第 ${r + 1} 行第 ${c + 1} 列缺少单元格`
              )
            }

            const root =
              find(
                makeKey(
                  cell.gridRow,
                  cell.gridCol
                )
              )

            if (
              root !==
              component.root
            ) {
              throwTableError(
                component.cells[0],
                `合并结果发生重叠：第 ${r + 1} 行第 ${c + 1} 列属于另一个单元格`
              )
            }
          }
        }
      }


      /* ======================================================
       * Generate rowspan / colspan.
       * ======================================================
       */

      for (
        const component of
          components.values()
      ) {
        /*
         * The first non-marker source cell is the actual
         * HTML cell.
         */
        const realCell =
          component.cells.find(
            function (cell) {
              return !cell.remove
            }
          )

        if (!realCell) {
          throwTableError(
            component.cells[0],
            '合并结果没有实际内容单元格'
          )
        }


        const rowspan =
          component.maxRow -
          component.minRow +
          1

        const colspan =
          component.maxCol -
          component.minCol +
          1


        if (
          rowspan > 1
        ) {
          realCell.open.attrSet(
            'rowspan',
            String(rowspan)
          )
        }


        if (
          colspan > 1
        ) {
          realCell.open.attrSet(
            'colspan',
            String(colspan)
          )
        }


        /* ----------------------------------------------------
         * Mark cells whose physical bottom edge reaches the
         * actual bottom of the table.
         *
         * Used by the Tuack CSS.
         * ----------------------------------------------------
         */

        if (
          component.maxRow ===
          rows.length - 1
        ) {
          realCell.open.attrJoin(
            'class',
            'table-bottom-cell'
          )
        }


        /*
         * Remove all marker cells.
         */
        for (
          const cell of
            component.cells
        ) {
          if (
            cell !== realCell
          ) {
            cell.remove = true
          }
        }
      }


      /* ======================================================
       * Remove marker tokens.
       * ======================================================
       */

      const removeTokens =
        new Set()


      for (
        const row of rows
      ) {
        for (
          const cell of row
        ) {
          if (
            !cell.remove
          ) {
            continue
          }

          if (
            cell.open
          ) {
            removeTokens.add(
              cell.open
            )
          }

          if (
            cell.inline
          ) {
            removeTokens.add(
              cell.inline
            )
          }

          if (
            cell.close
          ) {
            removeTokens.add(
              cell.close
            )
          }
        }
      }


      /*
       * Remove backwards so token indexes remain valid.
       */
      for (
        let i = end - 1;
        i > start;
        i--
      ) {
        if (
          removeTokens.has(
            tokens[i]
          )
        ) {
          tokens.splice(
            i,
            1
          )
        }
      }
    }


    /* ========================================================
     * Error handling
     * ========================================================
     */

    function throwTableError(
      cell,
      message
    ) {
      const token =
        cell && cell.open
          ? cell.open
          : null

      throw new Error(
        formatError(
          token,
          message
        )
      )
    }


    function formatError(
      token,
      message
    ) {
      const filename =
        currentSource

      let line = null

      if (
        token &&
        token.map &&
        token.map.length > 0
      ) {
        line =
          token.map[0] + 1
      }

      let location = ''

      if (
        filename
      ) {
        location +=
          filename
      }

      if (
        line !== null
      ) {
        if (location) {
          location += '：'
        }

        location +=
          `第 ${line} 行`
      }

      if (location) {
        location += '：'
      }

      return (
        '[markdown-it-merge-table] ' +
        location +
        message
      )
    }
  }
)