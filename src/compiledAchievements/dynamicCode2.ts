export function solve(x:number[][], y:number[][]):number[][] { // "user input example"
    return [[1,2],[1,2]];
}

export function generate(x:boolean):number[][] {
    if(x){
        return [[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1],[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1]];
    }else{
        return [[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1],[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1],[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1]];
    }
}
export function multiply2DArray(a:number[][], b:number[][]):number[][] {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        throw new Error('arguments should be in 2-dimensional array format');
     }
     let x = a.length,
     z = a[0].length,
     y = b[0].length;
     if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
     }
     let productRow = Array.apply(null, new
     Array(y)).map(Number.prototype.valueOf, 0);
     let product = new Array(x);
     for (let p = 0; p < x; p++) {
        product[p] = productRow.slice();
     }
     for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
           for (let k = 0; k < z; k++) {
              product[i][j] += a[i][k] * b[k][j];
           }
        }
     }
     return product;
}
export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

        for (let index = 0; index < 5; index++) { // test 5 sets of generated values
            let x = generate(true);
            let y = generate(false);
            console.log(index);
            if(solve(x,y)!=multiply2DArray(x,y)){
                return false;
            }
        }
        return true;
}