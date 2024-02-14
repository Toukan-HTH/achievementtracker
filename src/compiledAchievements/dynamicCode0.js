"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.convertInternal = exports.generate = exports.solve = void 0;
function solve(inches) { return inches * 2.54; }
exports.solve = solve;
function generate() {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
}
exports.generate = generate;
function convertInternal(x) {
    return x * 2.54;
}
exports.convertInternal = convertInternal;
function compare() {
    for (var index = 0; index < 5; index++) { // test 5 sets of generated values
        var x = generate();
        console.log(index);
        if (solve(x) != convertInternal(x)) {
            return false;
        }
    }
    return true;
}
exports.compare = compare;
