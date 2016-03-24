import Validator from '../main/utils/Validator';
import assert  from 'power-assert';
describe.only('Validator', () => {
  it('validateUserId', () => {
    let valids = ['abcd', '0189abcxyzABCXYZ_'];
    let invalids = ['', 'aaa', '!aaa', 'a aa', 'aa"a', 'aaa#'];

    valids.forEach((valid) => {
      assert.ok(Validator.validateUserId(valid), 'Its valid: ' + valid);
    });
    invalids.forEach((invalid) => {
      try {
        Validator.validateUserId(invalid);
        assert.fail('Its invalid: ' + invalid);
      } catch (error) {
        assert.ok(error);
      }
    });
  });
  it('validatePassword', () => {
    let valids = ['abcd', '0189abcxyzABCXYZ_'];
    let invalids = ['', 'aaa', '!aaa', 'a aa', 'aa"a', 'aaa#'];

    valids.forEach((valid) => {
      assert.ok(Validator.validatePassword(valid), 'Its valid: ' + valid);
    });
    invalids.forEach((invalid) => {
      try {
        Validator.validatePassword(invalid);
        assert.fail('Its invalid: ' + invalid);
      } catch (error) {
        assert.ok(error);
      }
    });
  });
});
