import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Ace from 'ace';

interface AceEditorProps extends React.Props<AceEditor> {
  code?: string;
  onChange?: Function;
  cursorStart?: number;
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
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.setShowPrintMargin(false);
    this.editor.setOptions({ minLines: 25 });
    this.editor.setOptions({ maxLines: 50 });
    this.editor.setValue(this.props.code, this.props.cursorStart);
    this.editor.on('change', this.onChange.bind(this));
  }

  componentWillReceiveProps(nextProps: AceEditorProps) {
    let oldProps = this.props;
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
    return (<div ref="root" style={style}>{this.props.code}</div>);
  }
}
