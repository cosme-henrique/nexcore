import { pick } from './pick';

const user = { id: 1, name: 'Cosme', email: 'cosme@email.com', password: 'secret' };

describe('pick', () => {
  it('should pick specified keys', () => {
    const result = pick(user, ['name', 'email']);
    expect(result).toEqual({ name: 'Cosme', email: 'cosme@email.com' });
  });

  it('should not include non-specified keys', () => {
    const result = pick(user, ['name']);
    expect(result).not.toHaveProperty('password');
  });

  it('should not mutate the original object', () => {
    pick(user, ['name']);
    expect(user).toHaveProperty('password');
  });

  it('should return empty object when no keys are picked', () => {
    const result = pick(user, []);
    expect(result).toEqual({});
  });
});
