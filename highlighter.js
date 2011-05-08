(function() {
// a javascript highlighter
// Copyright (c) 2011, Christopher Jeffrey (MIT Licensed)

var _DEBUG = false;

var highlight = (function() {
  var _style = { // github's color scheme
    STRING: 'color:#d14',
    COMMENT: 'color:#998',
    REGEX: 'color:#009926',
    RESERVED: 'color:#000;font-weight:bold',
    NUMBER: 'color:#099',
    TEXT: 'color:#000'
  };
  
  var escapeHTML = function(html) {
    return (html || '')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  var rules = [
    ['STRING', /^("(\\"|[^"])*"|'(\\'|[^'])*')/],
    ['COMMENT', /^(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/],
    ['REGEX', /^\/(\\\/|[^\/\n])+\/\w*/],
    ['RESERVED', /^([^\w])(this|var|while|break|continue|debugger|throw|try|catch|finally|do|let|with|for|if|else|function|return|switch|case|default|delete|get|in|instanceof|new|set|void|typeof|true|false|import|export|const|yield|Object|Array|String|Number|Date|RegExp)(?=[^\w])/],
    ['NUMBER', /^([^\w])(\d*\.\d+|\d+)/]
  ];
  
  rules.push(['TEXT', 
    RegExp([ 
      '^([\\s\\S]+?)(?=',
      rules.map(function(r) { 
        return r[1].source.slice(1); 
      }).join('|'),
      '|$)'
    ].join(''))
  ]);
  
  return function(text, style) {
    var out = [], cap;
    
    style = style || _style;
    
    // prepend a space to fix reserved word matches that 
    // might be at the beginning of the string -- HACKY!
    // need to do this because JS doesnt have lookbehinds =/
    text = ' ' + text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); 
    
    while (text.length) {
      for (var i = 0, l = rules.length; i < l; i++) {
        if (!(cap = rules[i][1].exec(text))) continue;
        text = text.slice(cap[0].length);
        
        // hack to fix no lookbehinds =(
        if (rules[i][0] === 'NUMBER' || rules[i][0] === 'RESERVED') {
          out.push(escapeHTML(cap[1]));
          cap[0] = cap[0].slice(1);
        }
        
        if (rules[i][0] === 'TEXT') {
          out.push(escapeHTML(cap[0]));
        } else {
          out.push(
            '<span style="' + style[rules[i][0]] + '">' 
            + escapeHTML(cap[0]) 
            + '</span>'
          );
        }
        break;
      }
    }
    
    // join and change the tabsize to 2
    out = out.join('').replace(/\t/g, '  ');
    
    // remove the first space found to fix the hacky thing done above
    out = out.replace(/(^|>)\x20/, '$1'); 
    
    // wrap in the "text" style
    out = '<span style="' + style.TEXT + '">' + out + '</span>'; 
    
    return out;
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = highlight;
} else {
  this.highlight = highlight;
}

// testing --- we can easily test this by .toStringing to function itself
// this is easiest to test in the browser
if (_DEBUG && typeof window !== 'undefined') {
  var highlighted = highlight(arguments.callee.toString());
  console.log(highlighted);
  
  document.body.innerHTML = highlighted;
  document.body.style.whiteSpace = 'pre-wrap';
  document.body.style.fontFamily = 'monospace';
}
}).call(this);