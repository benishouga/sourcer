import Validator from '../main/utils/Validator';
import assert  from 'power-assert';
describe('Validator', () => {

  it('validateAccount', () => {
    let valids = ['abcd', '0189abcxyzABCXYZ_'];
    let invalids = ['', 'aaa', '!aaa', 'a aa', 'aa"a', 'aaa#'];

    valids.forEach((valid) => {
      assert.ok(Validator.validateAccount(valid), 'Its valid: ' + valid);
    });
    invalids.forEach((invalid) => {
      try {
        Validator.validateAccount(invalid);
      } catch (error) {
        assert.ok(error);
        return;
      }
      assert.fail('Its expected invalid: ' + invalid);
    });
  });

  it('validatePassword', () => {
    let valids = ['abcd', '0189abcxyzABCXYZ_'];
    let invalids = ['', 'aaa'];

    valids.forEach((valid) => {
      assert.ok(Validator.validatePassword(valid), 'Its valid: ' + valid);
    });
    invalids.forEach((invalid) => {
      try {
        Validator.validatePassword(invalid);
      } catch (error) {
        assert.ok(error);
        return;
      }
      assert.fail('Its expected invalid: ' + invalid);
    });
  });
});
