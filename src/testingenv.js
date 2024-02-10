"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Achievement_1 = require("./Achievement");
var s = new Achievement_1.Achievement({
    generationFunction: "export function generate():number {\n        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;\n    }", // function to generate valid input for the validation function and the user input function
    validationFunction: "export function addInternal(x:number, y:number):number {\n        return x + y;\n    }", // function to test against, expect this functions output to equal the user input function to validate
    compareFunction: "export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function\n\n        for (let index = 0; index < 5; index++) { // test 5 sets of generated values\n            let x = generate();\n            let y = generate();\n            console.log(index);\n            if(solve(x,y)!=addInternal(x,y)){\n                return false;\n            }\n        }\n        return true;\n    }",
    difficultyRating: 1, // when creating the achievement, put a difficulty rating on it for easier sorting
    description: "expected user unput function signature is solve(x:number,y:number):number", // description on the achievement task
    id: 2,
});
s.run("export function solve(a:number, b:number):number { // \"user input example\"\n    return a-b;\n}\n");
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
