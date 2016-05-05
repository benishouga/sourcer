
export default class ComponentExplorer {
  static extractInputValue(ref: any): string {
    return ref.refs.input.value as string;
  }
  static extractSliderOnChange(event: any): number {
    return event.target.valueAsNumber;
  }
}
