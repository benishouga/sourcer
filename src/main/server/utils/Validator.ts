function normalize(v: string) {
  if (!v) {
    return '';
  }
  return v.trim();
}
function normalizeArray(strings: string[]): string[] {
  if (!strings) {
    return [];
  }
  return strings.map(string => string.trim()).filter(v => !!v);
}

export enum ValidationErrorType {
  Account = 'Account ',
  Password = 'Password ',
  Name = 'Name '
}

export class ValidationError extends Error {
  constructor(public type: ValidationErrorType, message: string) {
    super(message);
  }
}

export default class Validator {
  public static validateAccount(input: string): string {
    const account = normalize(input);
    if (account.length < 4 || /[^a-zA-Z0-9_]/.test(account)) {
      throw new ValidationError(ValidationErrorType.Account, 'Validation error : account');
    }

    if ('recent' === account || 'admin' === account || 'all' === account) {
      throw new ValidationError(ValidationErrorType.Account, 'Validation error : account reserved');
    }

    return account;
  }

  public static validatePassword(input: string): string {
    const password = normalize(input);
    if (password.length < 4) {
      throw new ValidationError(ValidationErrorType.Password, 'Validation error : password');
    }
    return password;
  }

  public static validateName(input: string): string {
    const name = normalize(input);
    if (!name || 11 < name.length) {
      throw new ValidationError(ValidationErrorType.Name, 'Validation error : name');
    }
    return name;
  }

  public static validateMembers(value: string[]) {
    return normalizeArray(value);
  }
}
