// scripts/fix-footnotes.js

// markdown-it-footnote 会把脚注区追加到**每一次** md.render() 的末尾。
// 本博客的折叠块渲染器（newRenderer.js）为了处理 ::: 块，会分块、递归地多次调用
// md.render，而且会把已渲染的 HTML 再喂回去渲染一次，于是空脚注区（只有 ↩︎ 回跳、
// 没有正文）最终会散落在文章中间（常见于 <summary> 里），无法靠"匹配结尾"清掉。
//
// 这里在文章渲染完成后统一处理：凡是剥掉标签和回跳链接后什么都不剩的脚注区，
// 连同它前面的分隔线一起删除；有正文的那个正常保留。
hexo.extend.filter.register('after_post_render', function (data) {
  if (!data.content || data.content.indexOf('class="footnotes"') === -1) return data;
  data.content = data.content.replace(
    /(?:<hr class="footnotes-sep">\s*)?<section class="footnotes">[\s\S]*?<\/section>\s*/g,
    function (whole) {
      const text = whole
        .replace(/<a[^>]*class="footnote-backref"[^>]*>[\s\S]*?<\/a>/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;|\u00a0|\s/g, '');
      return text === '' ? '' : whole;
    }
  );
  return data;
});
