import {Achievement} from "./Achievement";

var s:Achievement = new Achievement({
    generationFunction : `export function generate():number {
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }`, // function to generate valid input for the validation function and the user input function
    validationFunction : `export function addInternal(x:number, y:number):number {
        return x + y;
    }`, // function to test against, expect this functions output to equal the user input function to validate
    compareFunction: `export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

        for (let index = 0; index < 5; index++) { // test 5 sets of generated values
            let x = generate();
            let y = generate();
            console.log(index);
            if(solve(x,y)!=addInternal(x,y)){
                return false;
            }
        }
        return true;
    }`,
    difficultyRating : 1, // when creating the achievement, put a difficulty rating on it for easier sorting
    description : "expected user unput function signature is solve(x:number,y:number):number", // description on the achievement task
    id:2,
});


s.run(`export function solve(a:number, b:number):number { // "user input example"
    return a-b;
}
`);

/*
`
export function generate():number  {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
}
`

`export function addInternal(x:number, y:number):number { 
    return x + y;
}
`

`export function solve(a:number, b:number):number { // "user input example"
    return a+b;
}
`

`export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

    for (let index = 0; index < 5; index++) { // test 5 sets of generated values
        let x = generate();
        let y = generate();
        console.log(index);
        if(solve(x,y)!=addInternal(x,y)){
            return false;
        }
    }
    return true;
}`
*/
