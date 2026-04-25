import { omit } from './omit';

const user = { id: 1, name: 'Cosme', password: 'secret', token: 'abc123' };

describe('omit', () => {
  it('should remove specified keys', () => {
    const result = omit(user, ['password', 'token']);
    expect(result).toEqual({ id: 1, name: 'Cosme' });
  });

  it('should not mutate the original object', () => {
    omit(user, ['password']);
    expect(user).toHaveProperty('password');
  });

  it('should return full object when no keys are omitted', () => {
    const result = omit(user, []);
    expect(result).toEqual(user);
  });
});
