import { Achievement } from "./Achievement";
const achievements:Achievement[] = [new Achievement({    generationFunction : `export function generate():number {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
}`, // function to generate valid input for the validation function and the user input function
validationFunction : `export function convertInternal(x:number):number {
    return x*2.54;
}`, // function to test against, expect this functions output to equal the user input function to validate
compareFunction : `export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

    for (let index = 0; index < 5; index++) { // test 5 sets of generated values
        let x = generate();
        console.log(index);
        if(solve(x)!=convertInternal(x)){
            return false;
        }
    }
    return true;
}`, // function that will test the validate function against the user input function
difficultyRating : 1, // when creating the achievement, put a difficulty rating on it for easier sorting
description : `write a function that converts inches to centimeter, required signature of the function is solve(inches:number):number`, // description on the achievement task
id:0,
title:`Inches to centimeters`,
creator:`Henrik T.H`,}),

new Achievement({    generationFunction : `export function generate():number {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}`, // function to generate valid input for the validation function and the user input function
validationFunction : `export function isPrime(x:number):boolean {
    for (let i = 2; i < x; i++) {
        if (x % i === 0) {
            return false;
        }
    }

    return true;
}`, // function to test against, expect this functions output to equal the user input function to validate
compareFunction : `export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

    for (let index = 0; index < 5; index++) { // test 5 sets of generated values
        let x = generate();
        console.log(index);
        if(solve(x)!=isPrime(x)){
            return false;
        }
    }
    return true;
}`, // function that will test the validate function against the user input function
difficultyRating : 1, // when creating the achievement, put a difficulty rating on it for easier sorting
description : `write a function that returns if the a number is a prime number as true, and if not returns false. the function signature must be solve(x:number):boolean`, // description on the achievement task
id:1,
title:`Is that a prime?`,
creator:`Henrik T.H`,}),

new Achievement({    generationFunction : `export function generate(x:boolean):number[][] {
    if(x){
        return [[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1],[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1]];
    }else{
        return [[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1],[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1],[Math.floor(Math.random() * (10 - 1 + 1)) + 1,Math.floor(Math.random() * (10 - 1 + 1)) + 1]];
    }
}`, // function to generate valid input for the validation function and the user input function
validationFunction : `export function multiply2DArray(a:number[][], b:number[][]):number[][] {
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
}`, // function to test against, expect this functions output to equal the user input function to validate
compareFunction : `export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

    for (let index = 0; index < 5; index++) { // test 5 sets of generated values
        let x = generate(true);
        let y = generate(false);
        console.log(index);
        if(solve(x,y)!=multiply2DArray(x,y)){
            return false;
        }
    }
    return true;
}`, // function that will test the validate function against the user input function
difficultyRating : 3, // when creating the achievement, put a difficulty rating on it for easier sorting
description : `given two matrixes, write a function that multiplies them and returns the result. the function signature must be solve(x:number[][], y:number[][]):number[][]`, // description on the achievement task
id:2,
title:`Multiply Matrices`,
creator:`Henrik T.H`,}),

/*
new Achievement({    generationFunction : ``, // function to generate valid input for the validation function and the user input function
validationFunction : ``, // function to test against, expect this functions output to equal the user input function to validate
compareFunction : ``, // function that will test the validate function against the user input function
difficultyRating : 0, // when creating the achievement, put a difficulty rating on it for easier sorting
description : ``, // description on the achievement task
id:3,
title:``,
creator:``,})*/];

export {achievements};