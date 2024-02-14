export function solve(inches:number):number{return inches*2.54;}
export function generate():number {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
}
export function convertInternal(x:number):number {
    return x*2.54;
}
export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

    for (let index = 0; index < 5; index++) { // test 5 sets of generated values
        let x = generate();
        console.log(index);
        if(solve(x)!=convertInternal(x)){
            return false;
        }
    }
    return true;
}