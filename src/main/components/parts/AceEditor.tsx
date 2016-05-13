import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Ace from 'ace';

interface AceEditorProps extends React.Props<AceEditor> {
  className?: string;
  code?: string;
  onChange?: Function;
  cursorStart?: number;
  readOnly?: boolean;
  onSave?: () => void;
}

export default class AceEditor extends React.Component<AceEditorProps, {}> {

  editor: Ace.Editor;
  silent: boolean = false;

  static propTypes = {
    code: React.PropTypes.string,
    cursorStart: React.PropTypes.number
  };

  static defaultProps = {
    code: '//write your code here',
    cursorStart: 1
  };

  componentDidMount() {
    let refs = this.refs as any;
    const node = ReactDOM.findDOMNode(refs.root);
    this.editor = Ace.edit(node);
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme("ace/theme/chrome");
    let session = this.editor.getSession();
    session.setMode("ace/mode/javascript");
    session.setTabSize(2);
    this.editor.setShowPrintMargin(false);
    this.editor.setFontSize(11);
    this.editor.setOptions({ minLines: 42, maxLines: 42 });
    this.editor.setValue(this.props.code, this.props.cursorStart);
    this.editor.setReadOnly(this.props.readOnly);
    this.editor.on('change', this.onChange.bind(this));
    this.editor.commands.addCommand({
      name: "Save",
      exec: (editor) => { if (this.props.onSave) { this.props.onSave(); } },
      bindKey: { win: "Ctrl-S", mac: "Command-S" },
      readOnly: true
    });
  }

  componentWillReceiveProps(nextProps: AceEditorProps) {
    let oldProps = this.props;
    console.log(nextProps);
    if (this.editor.getValue() !== nextProps.code) {
      this.silent = true;
      this.editor.setValue(nextProps.code, nextProps.cursorStart);
      this.silent = false;
    }
  }

  onChange() {
    if (this.props.onChange && !this.silent) {
      this.props.onChange(this.editor.getValue());
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
    this.editor = null;
  }

  render() {
    const style = { fontSize: '14px !important', border: '1px solid lightgray' };
    return (<div ref="root" style={style} className={this.props.className}>{this.props.code}</div>);
  }
}
