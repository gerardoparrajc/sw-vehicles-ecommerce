// Simple test to verify Jest is working
describe('Basic functionality', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    const text = 'Hello World';
    expect(text).toContain('World');
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});
