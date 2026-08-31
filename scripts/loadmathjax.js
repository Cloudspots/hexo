hexo.extend.injector.register(
  'body_end',
  `<script>
    (function() {
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
          displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
          processEscapes: true
        },
        options: {
          skipHtmlTypes: 'script|noscript|style|textarea|pre|code|annotation|annotation-xml'
        }
      };

      function renderMath() {
        if (!window.MathJax || !window.MathJax.typesetPromise) {
          return;
        }

        // 只渲染文章正文
        const containers = document.querySelectorAll('.post-body');

        if (!containers.length) {
          return;
        }

        window.MathJax.typesetPromise([...containers])
          .then(() => {
            console.log('✅ MathJax 渲染完成');
          })
          .catch(e => {
            console.warn('⚠️ MathJax 渲染异常:', e);
          });
      }

      if (typeof window.MathJax.typesetPromise === 'undefined') {
        const script = document.createElement('script');

        script.src =
          'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';

        script.async = true;

        script.onload = function() {
          console.log('📦 MathJax CDN 加载完成');
          setTimeout(renderMath, 300);
        };

        document.head.appendChild(script);
      }

      document.addEventListener('pjax:complete', renderMath);
      window.addEventListener('load', renderMath);
    })();
  </script>`,
  'default'
);