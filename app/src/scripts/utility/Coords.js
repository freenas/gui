// COORDINATE TRANSFORMATION
// =========================
// A small utility class which bears mute testiment to the mutual hatred between
// linear algebra and myself. I should have paid more attention in school, and
// now we all have to live with that burden. Check ignition and may God's love
// be with you.

"use strict";

class Coords {

  static cartToBary ( A, B, C, P ) {
    //     B     | This function will solve for the Barycentric Coordinates of
    //    / \    | a point `P` with known Caresian Coordinates. Each variable in
    //   / P \   | the function's arguments should represent an array tuple that
    //  /     \  | is the point's Caresian Coordinates (eg [0,1] ). Values must
    // A```````C | be provided as numbers.

    let detA;
    let detA1, detA2, detA3;
    let U, V, W;

    // Determinant A is the common denominator for all three vertices, so we
    // compute that first.
    // ((X1 * Y2) - (X1 * Y3) - (X2 * Y1) + (X2 * Y3) + (X3 * Y1) - (X3 * Y2))
    detA = ( ( A[0] * B[1] )
           - ( A[0] * C[1] )
           - ( B[0] * A[1] )
           + ( B[0] * C[1] )
           + ( C[0] * A[1] )
           - ( C[0] * B[1] )
           );

    // The three remaining determinants will provide the Barycentric Coordinates
    // for point P, once divided by Determinant A.

    // Determinant for scalar U
    // ((X4 * Y2) - (X4 * Y3) - (X2 * Y4) + (X2 * Y3) + (X3 * Y4) - (X3 * Y2))
    detA1 = ( ( P[0] * B[1] )
            - ( P[0] * C[1] )
            - ( B[0] * P[1] )
            + ( B[0] * C[1] )
            + ( C[0] * P[1] )
            - ( C[0] * B[1] )
            );

    // Determinant for scalar V
    // ((X1 * Y4) - (X1 * Y3) - (X4 * Y1) + (X4 * Y3) + (X3 * Y1) - (X3 * Y4))
    detA2 = ( ( A[0] * P[1] )
            - ( A[0] * C[1] )
            - ( P[0] * A[1] )
            + ( P[0] * C[1] )
            + ( C[0] * A[1] )
            - ( C[0] * P[1] )
            );

    // Determinant for scalar W
    // ((X1 * Y2) - (X1 * Y4) - (X2 * Y1) + (X2 * Y4) + (X4 * Y1) - (X4 * Y2))
    detA3 = ( ( A[0] * B[1] )
            - ( A[0] * P[1] )
            - ( B[0] * A[1] )
            + ( B[0] * P[1] )
            + ( P[0] * A[1] )
            - ( P[0] * B[1] )
            );

    U = detA1 / detA;
    V = detA2 / detA;
    W = detA3 / detA;

    return [ U, V, W ];
  }
}

export default Coords;
