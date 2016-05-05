function normalize(v: string) {
  if (!v) {
    return '';
  }
  return v.trim();
}
function normalizeArray(v: string[]): string[] {
  if (!v) {
    return [];
  }
  return v.map(v => v.trim()).filter(v => !!v);
}
export default class Validator {
  static validateAccount(account: string): string {
    account = normalize(account);
    if (account.length < 4 || /[^a-zA-Z0-9_]/.test(account)) {
      throw 'Validation error : account';
    }

    if ('recent' === account || 'admin' === account || 'all' === account) {
      throw 'Validation error : account reserved';
    }

    return account;
  }

  static validatePassword(password: string): string {
    password = normalize(password);
    if (password.length < 4) {
      throw 'Validation error : password';
    }
    return password;
  }

  static validateName(name: string): string {
    name = normalize(name);
    if (!name) {
      throw 'Validation error : password';
    }
    return name;
  }

  static validateMembers(value: string[]) {
    return normalizeArray(value);
  }
}
