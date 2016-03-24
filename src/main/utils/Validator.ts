export default class Validator {
  static validateUserId(userId: string): string {
    if (userId.length < 4 && /[^a-zA-Z0-9_]/.test(userId)) {
      throw 'Validation error : userId';
    }
    return userId;
  }
  static validatePassword(password: string): string {
    if (password.length < 4) {
      throw 'Validation error : password';
    }
    return password;
  }
}
