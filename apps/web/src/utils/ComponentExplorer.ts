export default class ComponentExplorer {
  public static extractInputValue(ref: any | null): string {
    if (!ref || !ref.inputRef) {
      return '';
    }
    return ref.inputRef.value as string;
  }
  public static extractSliderOnChange(event: any): number {
    return event.target.valueAsNumber;
  }
}
