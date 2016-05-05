(function() {
  "use strict";
  document.addEventListener('DOMContentLoaded', () => {
    let elements = document.querySelectorAll('pre.code');

    for(let i = 0; i < elements.length; i++ ) {
      let element = elements[i];
      let editor = ace.edit(element);
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/javascript");
      editor.setAutoScrollEditorIntoView(false);
      editor.setOption("maxLines", 40);
      editor.setReadOnly(true);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    let elements = document.querySelectorAll('textarea.code');

    for(let i = 0; i < elements.length; i++ ) {
      (function() {
        let element = elements[i];
        element.style.display = 'none';
        let pre = document.createElement("pre");
        pre.className = 'code';
        var parent = element.parentNode;
        parent.insertBefore(pre, element);

        setTimeout(function() {
          let editor = ace.edit(pre);
          editor.setTheme("ace/theme/chrome");
          let session = editor.getSession();
          session.setMode("ace/mode/javascript");
          session.setTabSize(2);
          editor.setOption("maxLines", 22);
          editor.setAutoScrollEditorIntoView(false);
          editor.$blockScrolling = Infinity;
          session.on('change', function(e) {
            element.value = editor.getValue();
          });
          editor.setValue(element.value);
          editor.gotoLine(0);
        });
      })();
    }
  });
}).call(this);
