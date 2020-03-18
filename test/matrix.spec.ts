import {Matrix} from '../src/Matrix';

test('create a new matrix', () => {
    const matrix = new Matrix(1, 2, 3, 4);
    expect(matrix).toBeInstanceOf(Matrix);
    expect(matrix).toHaveProperty('data', [[1, 2], [3, 4]]);
});
