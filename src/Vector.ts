import { Matrix } from './Matrix';

/**
 * A 2-dimensional vector.
 */
export class Vector {
    i: number;
    j: number;

    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
    }

    /**
     * Duplicates this vector.
     */
    copy(): Vector {
        return new Vector(this.i, this.j);
    }

    /**
     * Return the magnitude scalar (length) for this vector.
     */
    magnitude(): number {
        return Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2));
    }

    /**
     * Returns the unit vector for this vector.
     */
    normalized(): Vector {
        return this.divide(this.magnitude());
    }

    // angle(): number {
    //     return arctan(this.j / this.i);
    // }

    /**
     * Addes another vector to this vector.
     * @param vector the other vector
     */
    add(vector: Vector): Vector {
        const result = this.copy();
        result.i += vector.i;
        result.j += vector.j;
        return result;
    }

    /**
     * Subtracts another vector from this vector.
     * @param vector the other vector
     */
    subtract(vector: Vector): Vector {
        const result = this.copy();
        result.i -= vector.i;
        result.j -= vector.j;
        return result;
    }

    /**
     * Divides this vector by a number.
     */
    divide(scalar: number): Vector {
        const result = this.copy();
        result.i /= scalar;
        result.j /= scalar;
        return result;
    }

    /**
     * Multiply this vector by a number.
     */
    multiply(scalar: number): Vector {
        const result = this.copy();
        result.i *= scalar;
        result.j *= scalar;
        return result;
    }

    /**
     * Returns a vector perpindiculat to this vector.
     */
    perpendicular(): Vector {
        return new Vector(-this.j, this.i);
    }

    /**
     * Perform a matrix transformation on this vector.
     */
    transform(matrix: Matrix): Vector {
        const i = (matrix.data[0][0] * this.i) + (matrix.data[0][1] * this.j);
        const j = (matrix.data[1][0] * this.i) + (matrix.data[1][1] * this.j);
        return new Vector(i, j);
    }

    /**
     * Returns the string representation for this vector. Useful for console.log(thisVector).
     */
    toString(): string {
        return `(${this.i}, ${this.j})`;
    }
}
