import Env from '../Env';
import { ResourceId } from '../../dts/StringResource';

export default class Validator {
  public static validateAccount(validationResults: ResourceId[], input: string): void {
    if (input.length < 4) {
      validationResults.push('invalidAccountTooShort');
    }

    if (/[^a-zA-Z0-9_]/.test(input)) {
      validationResults.push('invalidAccountCharacterClass');
    }

    if ('recent' === input || 'admin' === input || 'all' === input) {
      validationResults.push('invalidAccountReserved');
    }
  }

  public static validatePassword(validationResults: ResourceId[], input: string): void {
    if (input.length < 4) {
      validationResults.push('invalidPasswordTooShort');
    }
  }

  public static validateName(validationResults: ResourceId[], input: string): void {
    if (!input) {
      validationResults.push(Env.isTeamGame ? 'invalidTeamNameEmpty' : 'invalidNameEmpty');
    }

    if (21 < input.length) {
      validationResults.push(Env.isTeamGame ? 'invalidTeamNameTooLong' : 'invalidNameTooLong');
    }
  }
}
