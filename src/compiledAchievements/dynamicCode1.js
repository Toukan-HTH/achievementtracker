"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.isPrime = exports.generate = exports.solve = void 0;
function solve(x) { return x * 2.54; }
exports.solve = solve;
function generate() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
exports.generate = generate;
function isPrime(x) {
    for (var i = 2; i < x; i++) {
        if (x % i === 0) {
            return false;
        }
    }
    return true;
}
exports.isPrime = isPrime;
function compare() {
    for (var index = 0; index < 5; index++) { // test 5 sets of generated values
        var x = generate();
        console.log(index);
        if (solve(x) != isPrime(x)) {
            return false;
        }
    }
    return true;
}
exports.compare = compare;
