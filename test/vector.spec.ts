import Vector from '../src/Vector';

test('create a new vector', () => {
    const vector = new Vector(1, 1);
    expect(vector).toBeInstanceOf(Vector);
    expect(vector).toHaveProperty('i', 1);
    expect(vector).toHaveProperty('j', 1);
});

test('copy a vector', () => {
    const vector = new Vector(1, 1);
    const vectorCopy = vector.copy();
    expect(vectorCopy).toBeInstanceOf(Vector);
    expect(vectorCopy).not.toBe(vector);
    expect(vectorCopy).toHaveProperty('i', 1);
    expect(vectorCopy).toHaveProperty('j', 1);
});

test('get magnitude', () => {
    const vector = new Vector(1, 1);
    const magnitude = vector.magnitude();
    expect(magnitude).toBeCloseTo(1.41);
});

test('get a normalized vector', () => {
    const vector = new Vector(1, 1);
    const normalized = vector.normalized();
    expect(normalized).toBeInstanceOf(Vector);
    expect(normalized).not.toBe(vector);
    expect(normalized).toHaveProperty('i');
    expect(normalized).toHaveProperty('j');
    expect(normalized.i).toBeCloseTo(0.71);
    expect(normalized.j).toBeCloseTo(0.71);
});
