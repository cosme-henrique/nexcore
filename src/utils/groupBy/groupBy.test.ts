import { groupBy } from './groupBy';

const orders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'delivered' },
  { id: 3, status: 'pending' },
  { id: 4, status: 'cancelled' },
];

describe('groupBy', () => {
  it('should group items by key', () => {
    const result = groupBy(orders, 'status');
    expect(result.pending).toHaveLength(2);
    expect(result.delivered).toHaveLength(1);
    expect(result.cancelled).toHaveLength(1);
  });

  it('should contain correct items in each group', () => {
    const result = groupBy(orders, 'status');
    expect(result.pending).toEqual([
      { id: 1, status: 'pending' },
      { id: 3, status: 'pending' },
    ]);
  });

  it('should return empty object for empty array', () => {
    expect(groupBy([], 'status')).toEqual({});
  });
});
