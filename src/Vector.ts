import Matrix from './Matrix';

export default class Vector {
    i: number;
    j: number;

    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
    }

    copy(): Vector {
        return new Vector(this.i, this.j);
    }

    magnitude(): number {
        return Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2));
    }

    normalized(): Vector {
        return this.divide(this.magnitude());
    }

    // angle(): number {
    //     return arctan(this.j / this.i);
    // }

    add(vector: Vector): Vector {
        const result = this.copy();
        result.i += vector.i;
        result.j += vector.j;
        return result;
    }

    subtract(vector: Vector): Vector {
        const result = this.copy();
        result.i -= vector.i;
        result.j -= vector.j;
        return result;
    }

    divide(scalar: number): Vector {
        const result = this.copy();
        result.i /= scalar;
        result.j /= scalar;
        return result;
    }

    multiply(scalar: number): Vector {
        const result = this.copy();
        result.i *= scalar;
        result.j *= scalar;
        return result;
    }

    perpendicular(): Vector {
        return new Vector(-this.j, this.i);
    }

    transform(matrix: Matrix): Vector {
        const i = (matrix.data[0][0] * this.i) + (matrix.data[0][1] * this.j);
        const j = (matrix.data[1][0] * this.i) + (matrix.data[1][1] * this.j);

        return new Vector(i, j);
    }

    toString(): string {
        return `(${this.i}, ${this.j})`;
    }
}
