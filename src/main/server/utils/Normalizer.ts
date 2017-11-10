export default class Normalizer {
  public static normalize(v: string) {
    if (!v) {
      return '';
    }
    return v.trim();
  }

  public static normalizeArray(strings: string[]): string[] {
    if (!strings) {
      return [];
    }
    return strings.map(string => string.trim()).filter(v => !!v);
  }
}
