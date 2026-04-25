import { sortBy } from './sortBy';

const products = [
  { name: 'Camiseta', price: 50 },
  { name: 'Tênis', price: 200 },
  { name: 'Boné', price: 30 },
];

describe('sortBy', () => {
  it('should sort ascending by default', () => {
    const result = sortBy(products, 'price');
    expect(result[0].price).toBe(30);
    expect(result[2].price).toBe(200);
  });

  it('should sort descending', () => {
    const result = sortBy(products, 'price', 'desc');
    expect(result[0].price).toBe(200);
    expect(result[2].price).toBe(30);
  });

  it('should sort by string key', () => {
    const result = sortBy(products, 'name');
    expect(result[0].name).toBe('Boné');
    expect(result[2].name).toBe('Tênis');
  });

  it('should not mutate the original array', () => {
    const original = [...products];
    sortBy(products, 'price');
    expect(products).toEqual(original);
  });
});
