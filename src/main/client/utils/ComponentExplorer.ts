
export default class ComponentExplorer {
  public static extractInputValue(ref: any): string {
    return ref.inputRef.value as string;
  }
  public static extractSliderOnChange(event: any): number {
    return event.target.valueAsNumber;
  }
}
