import React, { useEffect, useRef } from 'react';
import * as Ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/chrome';

export interface AceEditorProps {
  className?: string;
  code: string;
  onChange?: (value: string) => void;
  cursorStart?: number;
  readOnly: boolean;
  onSave?: () => void;
}

const AceEditor: React.FC<AceEditorProps> = (props) => {
  const editorRef = useRef<Ace.Editor | null>(null);
  const silentRef = useRef<boolean>(false);

  useEffect(() => {
    const node = editorRef.current!.container;
    node.addEventListener('keydown', onKeyDown);
    const editor = Ace.edit(node);
    editor.$blockScrolling = Infinity;
    editor.setTheme('ace/theme/chrome');
    const session = editor.getSession();
    session.setMode('ace/mode/javascript');
    session.setTabSize(2);
    editor.setShowPrintMargin(false);
    editor.setFontSize('11');
    editor.setOptions({ minLines: 42, maxLines: 42 });
    editor.setValue(props.code || '', props.cursorStart);
    editor.setReadOnly(props.readOnly);
    editor.on('change', onChange);
    editor.commands.addCommand({
      name: 'Save',
      exec: (_editor: Ace.Editor) => {
        if (props.onSave) {
          props.onSave();
        }
      },
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      readOnly: true
    });
    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
      node.removeEventListener('keydown', onKeyDown);
    };
  }, [props.code, props.cursorStart, props.readOnly, props.onSave]);

  const onChange = () => {
    if (props.onChange && !silentRef.current && editorRef.current) {
      props.onChange(editorRef.current.getValue());
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 32: // Space
        event.stopPropagation();
        break;
    }
  };

  const style = { fontSize: '14px !important', border: '1px solid lightgray' };
  return (
    <div ref={editorRef} style={style} className={props.className}>
      {props.code}
    </div>
  );
};

export default AceEditor;
