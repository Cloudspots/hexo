// text-pipeline/anti-ai.js
module.exports = {
  // 在 Markdown 渲染前处理（原始文本）
  stage: 'before_post_render',

  // 使用 replace 数组：每个元素为 [正则, 替换字符串]
  replace: [
    [
      // 匹配整行：行首可选空白 + ::anti-ai[...] + 行尾可选空白
      /^\s*::anti-ai\[[^\]]*\]\s*$/gm,
      ''  // 替换为空（即删除该行）
    ]
  ]
};
