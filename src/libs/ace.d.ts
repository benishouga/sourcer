declare var Ace: Ace.Ace;
declare namespace Ace {
  interface Ace {
    edit(node: any): Editor;
  }
  interface Editor {
    setTheme(theme: string): void;
    getSession(): Session;
    setShowPrintMargin(showPrintMargin: boolean): void;
    setOptions(options: any): void;
    setFontSize(size: number): void;
    setReadOnly(readOnly: boolean): void;
    destroy(): void;
    on(type: string, listener: Function): void;
    setValue(value: string, cursorStart?: number): void;
    getValue(): string;

    $blockScrolling: number;
    commands: Commands;
  }
  interface Session {
    setMode(mode: string): void;
    setTabSize(size: number): void;
  }
  interface Commands {
    addCommand(command: Command): void;
  }
  interface Command {
    name: string;
    exec: (editor: Editor) => void;
    bindKey: { win: string; mac: string };
    scrollIntoView?: string;
    readOnly: boolean;
  }
}

declare module 'ace' {
  export = Ace;
}
