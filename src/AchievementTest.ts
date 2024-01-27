import * as fs from 'fs';
import path = require('path');
import { exec } from 'child_process';
import { promisify } from 'util';
import * as vm from 'vm';

const tsCode = `
export function dynamicMethod() {
    console.log("Hello from dynamic method!");
    return 1;
}
`;

const tsFilePath = path.dirname(__filename).slice(0,-4)+'src\\compiledAchievements\\dynamicCode.ts';
const jsFilePath = path.dirname(__filename).slice(0,-4)+'src\\compiledAchievements\\dynamicCode.js'; // the compiler does not like dynamic modules that requires a .replace("ts","js") in it. for now this is a workaround.
const tsFileName = "dynamicCode.ts";
const execAsync = promisify(exec);


const writeTsCodeToFile = () => {
return new Promise<void>((resolve, reject) => {
    fs.writeFile(tsFilePath, tsCode, (err) => {
    if (err) {
        reject(err);
    } else {
        resolve();
    }
    });
});
};

// Function to transpile TypeScript code to JavaScript
const transpileTsCode = async () => {
    try {
      await execAsync(`tsc ${tsFilePath}`);
    } catch (err) {
      throw new Error(`Error during transpilation: ${(err as Error).message}`);
    }
  };



  const loadAndExecute = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const dynamicCode = fs.readFileSync(jsFilePath, 'utf-8');
        const context = { exports: {} };
        vm.runInNewContext(dynamicCode, context);
        const dynamicModule = context.exports as { dynamicMethod: () => number };
        console.log(dynamicModule.dynamicMethod());

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

export const run = async () => {
try {
    await writeTsCodeToFile();
    await transpileTsCode();
    await loadAndExecute();
    console.log(`TypeScript code has been written to ${tsFileName}`);
} catch (err) {
    console.error('Error:', (err as Error).message);
}
};