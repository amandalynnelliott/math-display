/**
 * A row-major 2x2 matrix.
 */
export class Matrix {
    data: number[][];

    constructor(m00: number, m01: number, m10: number, m11: number) {
        this.data = [
            [m00, m01],
            [m10, m11]
        ];
    }
}
