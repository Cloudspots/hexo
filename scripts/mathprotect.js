hexo.extend.filter.register('markdown-it:renderer', function (md) {
  const originalRender = md.render.bind(md)

  // Private-use Unicode characters.
  // Markdown-it 不会把它们当成反斜杠转义。
  const BACKSLASH = '\uE000'

  function protectMath(src) {
    // 先保护 $$...$$，避免里面再被 $...$ 匹配一次。
    src = src.replace(/\$\$([\s\S]*?)\$\$/g, (_, content) => {
      return `$$${content.replace(/\\/g, BACKSLASH)}$$`
    })

    // 再保护 $...$
    src = src.replace(/\$([^\n$]+?)\$/g, (_, content) => {
      return `$${content.replace(/\\/g, BACKSLASH)}$`
    })

    return src
  }

  function restoreMath(html) {
    return html.replace(/\uE000/g, '\\')
  }

  md.render = function (src, env) {
    const protectedSrc = protectMath(src)
    const result = originalRender(protectedSrc, env)
    return restoreMath(result)
  }

  return md
})