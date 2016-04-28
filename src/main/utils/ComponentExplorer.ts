
export default class ComponentExplorer {
  static extractInputValue(ref: any): string {
    return ref.refs.input.value as string;
  }
}
