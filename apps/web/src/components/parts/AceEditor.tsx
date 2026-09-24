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

export default class AceEditor extends React.Component<AceEditorProps, {}> {
  private editor: Ace.Editor | null = null;
  private silent: boolean = false;
  private rootRef = React.createRef<HTMLDivElement>();

  public static defaultProps = {
    code: '//write your code here',
    cursorStart: 1
  };

  public componentDidMount() {
    const node = this.rootRef.current;
    if (!node) {
      return;
    }
    node.addEventListener('keydown', this.onKeyDown);
    this.editor = Ace.edit(node);
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme('ace/theme/chrome');
    const session = this.editor.getSession();
    session.setMode('ace/mode/javascript');
    session.setTabSize(2);
    this.editor.setShowPrintMargin(false);
    this.editor.setFontSize('11');
    this.editor.setOptions({ minLines: 42, maxLines: 42 });
    this.editor.setValue(this.props.code || '', this.props.cursorStart);
    this.editor.setReadOnly(this.props.readOnly);
    this.editor.on('change', this.onChange.bind(this));
    this.editor.commands.addCommand({
      name: 'Save',
      exec: (_editor: Ace.Editor) => {
        if (this.props.onSave) {
          this.props.onSave();
        }
      },
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      readOnly: true
    });
  }

  public shouldComponentUpdate(_nextProps: AceEditorProps) {
    return false;
  }

  public onChange() {
    if (this.props.onChange && !this.silent && this.editor) {
      this.props.onChange(this.editor.getValue());
    }
  }

  public componentWillUnmount() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    const node = this.rootRef.current;
    if (node) {
      node.removeEventListener('keydown', this.onKeyDown);
    }
  }

  public render() {
    const style = { fontSize: '14px !important', border: '1px solid lightgray' };
    return (
      <div ref={this.rootRef} style={style} className={this.props.className}>
        {this.props.code}
      </div>
    );
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 32: // Space
        event.stopPropagation();
        break;
    }
  };
}
