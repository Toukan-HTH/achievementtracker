export function solve(x:number):number{return x*2.54;}
export function generate():number {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
export function isPrime(x:number):boolean {
    for (let i = 2; i < x; i++) {
        if (x % i === 0) {
            return false;
        }
    }

    return true;
}
export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

    for (let index = 0; index < 5; index++) { // test 5 sets of generated values
        let x = generate();
        console.log(index);
        if(solve(x)!=isPrime(x)){
            return false;
        }
    }
    return true;
}