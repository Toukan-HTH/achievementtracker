"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.addInternal = exports.generate = exports.solve = void 0;
function solve(a, b) {
    return a - b;
}
exports.solve = solve;
function generate() {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
}
exports.generate = generate;
function addInternal(x, y) {
    return x + y;
}
exports.addInternal = addInternal;
function compare() {
    for (var index = 0; index < 5; index++) { // test 5 sets of generated values
        var x = generate();
        var y = generate();
        console.log(index);
        if (solve(x, y) != addInternal(x, y)) {
            return false;
        }
    }
    return true;
}
exports.compare = compare;
