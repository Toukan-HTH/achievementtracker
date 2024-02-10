export function solve(a:number, b:number):number { // "user input example"
    return a-b;
}

export function generate():number {
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }
export function addInternal(x:number, y:number):number {
        return x + y;
    }
export function compare():boolean { // also a function generated on achievement creation, used to compare user input vs validation function

        for (let index = 0; index < 5; index++) { // test 5 sets of generated values
            let x = generate();
            let y = generate();
            console.log(index);
            if(solve(x,y)!=addInternal(x,y)){
                return false;
            }
        }
        return true;
    }