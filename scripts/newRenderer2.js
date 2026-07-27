// scripts/newRenderer2.js

function newRenderer2(md, str)
{
  let res = [];
  const lns = str.split('\n');
  const isend = (s) => { s = s.trim(); if(s.length >= 3 && s == ':'.repeat(s.length)) return s.length; else return -1; }
  const getstart_f = (s) => { s = s.trim(); let x = s.indexOf('{'), y = s.lastIndexOf('}'); if(x == -1 || y == -1) return null; if(!s.startsWith(':::')) return null; for(let i=0;;i++) if(s[i] != ':') { if(s.substring(i, x) == 'align') return [i,s.substring(x+1,y)]; else return null; } };
  let vals = [];
  let vkp = [[]];
  let tmp = [];
  for(let i=0;i<lns.length;i++)
  {
    let p = isend(lns[i]);
    if(vals.length > 0 && p != -1 && p == vals[vals.length - 1].cnt)
    {
      if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
      tmp = [];
      let g = newRenderer2(md, vkp[vkp.length - 1].join('\n'));
      // if(vals.length > 1) console.log('!!!\n', g, '!!!\n');
      vkp.pop();
      vkp[vkp.length - 1].push(`<div align="${vals[vals.length-1].ali}">
          ${g}
        </div>`);
      vals.pop();
      continue;
    }
    let r = getstart_f(lns[i]);
    if(r == null)
    {
      tmp.push(lns[i]);
      // vkp[vkp.length - 1].push(lns[i]);
      continue;
    }
    else
    {
      if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
      tmp = [];
      vals.push({cnt: r[0], ali: r[1]});
      vkp.push([]);
    }
  }
  if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
  let arp = [];
  while(vkp.length > 1)
  {
    let g = newRenderer2(md, vkp[vkp.length - 1].join('\n'));
    vkp.pop();
    vkp[vkp.length - 1].push(`<div align="${vals[vals.length-1].ali}">
          ${g}
        </div>`);
    vals.pop();
  }
  return vkp[0].join('\n');
}

hexo.extend.filter.register('markdown-it:renderer', function (md) {
  // console.log(2);

  md.block.ruler.after('fold_block', 'align', function (state, startLine, endLine, silent)
  {
    // console.log(typeof(state));
    // console.log(state); while(true){};
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const lineText = state.src.slice(start, max);
    const isend = (s) => { s = s.trim(); if(s.length >= 3 && s == ':'.repeat(s.length)) return s.length; else return -1; }
  const getstart_f = (s) => { s = s.trim(); let x = s.indexOf('{'), y = s.lastIndexOf('}'); if(x == -1 || y == -1) return null; if(!s.startsWith(':::')) return null; for(let i=0;;i++) if(s[i] != ':') { if(s.substring(i, x) == 'align') return [i,s.substring(x+1,y)]; else return null; } };

    const startMatch = getstart_f(lineText);
    if (!startMatch) return false;
    let vals = [];
    let contentLines = [];
    let endLineFound = endLine;
    for(let i=startLine;i<endLine;i++)
    {
      let ibf = state.src.slice(state.bMarks[i] + state.tShift[i], state.eMarks[i]);
      contentLines.push(ibf);
      let p = isend(ibf);
      if(vals.length > 0 && p != -1 && p == vals[vals.length - 1].cnt)
      {
        if(vals.length == 1)
        {
          endLineFound = i;
          break;
        }
        vals.pop();
        continue;
      }
      let r = getstart_f(ibf);
      if(r == null) continue;
      else vals.push({cnt: r[0], ali: r[1]});
    }
    const content = contentLines.join('\n');

    const token = state.push('align', 'details', 0);
    token.block = true;
    token.info = vals[0].type;
    token.title = vals[0].title;
    token.content = content;
    token.map = [startLine, endLineFound + 1];

    state.line = endLineFound + 1;
    return true;
  });

  md.renderer.rules.align = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    let content = token.content || '';

    return newRenderer2(md, content);
  };
});