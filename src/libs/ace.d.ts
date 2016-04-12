declare var Ace: Ace.Ace;
declare module Ace {
  interface Ace {
    edit(node: any): Editor;
  }
  interface Editor {
    setTheme(theme: string): void;
    getSession(): Session;
    setShowPrintMargin(showPrintMargin: boolean): void;
    setOptions(options: any): void;
    destroy(): void;
    on(type: string, listener: Function): void;
    setValue(value: string, cursorStart?: number): void;
    getValue(): string;
    $blockScrolling: number;
  }
  interface Session {
    setMode(mode: string): void;
  }
}

declare module "ace" {
  export = Ace;
}
