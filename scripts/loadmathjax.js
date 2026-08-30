hexo.extend.injector.register('body_end', 
  `<script>
    (function() {
      // ⭐ 必须放在 CDN 加载之前，且要确保不被后续覆盖
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true
        },
        options: {
          skipHtmlTypes: 'script|noscript|style|textarea|pre|code|annotation|annotation-xml'
        }
      };

      function renderMath() {
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise().then(() => {
            console.log('✅ MathJax 渲染完成');
          }).catch(e => console.warn('渲染异常:', e));
        }
      }

      // 如果核心库尚未加载，则注入 CDN
      if (typeof window.MathJax.typesetPromise === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
        script.async = true;
        script.onload = () => {
          console.log('📦 CDN 加载完成');
          setTimeout(renderMath, 300);
        };
        document.head.appendChild(script);
      } else {
        renderMath();
      }

      // PJAX 事件监听
      document.addEventListener('pjax:complete', renderMath);
      document.addEventListener('pjax:success', renderMath);
      window.addEventListener('load', renderMath);
    })();
  </script>`,
  'default'
);