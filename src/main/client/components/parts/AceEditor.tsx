import * as React from 'react';
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

const STYLE = { fontSize: '14px !important', border: '1px solid lightgray' };
const DEFAULT_PROPS = {
  code: '//write your code here',
  cursorStart: 1
};

export default function AceEditor(arg: AceEditorProps) {
  const props: AceEditorProps = { ...DEFAULT_PROPS, ...arg };
  const rootRef = React.useRef<HTMLDivElement>(null);

  function onChange(editor: Ace.Editor | null) {
    if (props.onChange && editor) {
      props.onChange(editor.getValue());
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 32: // Space
        event.stopPropagation();
        break;
    }
  }

  React.useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    rootRef.current.addEventListener('keydown', onKeyDown);
    let editor: Ace.Editor | null = Ace.edit(rootRef.current);
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
    editor.on('change', () => onChange(editor));
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
    return () => {
      if (editor) {
        editor.destroy();
        editor = null;
      }
      if (rootRef.current) {
        rootRef.current.removeEventListener('keydown', onKeyDown);
      }
    };
  }, []);

  return React.useMemo(() => {
    return (
      <div ref={rootRef} style={STYLE} className={props.className}>
        {props.code}
      </div>
    );
  }, []);
}
