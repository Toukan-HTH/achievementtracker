import type {AchievementPrimitive} from "./types/Achievement.d.ts";
import * as fs from 'fs';
import path = require('path');
import { exec } from 'child_process';
import { promisify } from 'util';
import * as vm from 'vm';

const execAsync = promisify(exec);

export class Achievement{
    achievement : AchievementPrimitive;
    tsFilePath : string;
    jsFilePath : string;
    tsFileName : string;
    constructor(s : AchievementPrimitive){
        this.achievement = s;
        this.tsFilePath = path.dirname(__filename).slice(0,-4)+'src\\compiledAchievements\\dynamicCode'+this.achievement.id+'.ts';
        this.jsFilePath = path.dirname(__filename).slice(0,-4)+'src\\compiledAchievements\\dynamicCode'+this.achievement.id+'.js'; // the compiler does not like dynamic modules that 
        this.tsFileName = 'dynamicCode'+this.achievement.id+'.js';
    }



    writeTsCodeToFile = async (file:string) => {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(this.tsFilePath, file, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
            });
        });
    };

    transpileTsCode = async () => {
        try {
          await execAsync(`tsc ${this.tsFilePath}`);
        } catch (err) {
          throw new Error(`Error during transpilation: ${(err as Error).message}`);
        }
    };

    loadAndExecute = () => {
        return new Promise<boolean>((resolve, reject) => {
          try {
            const dynamicCode = fs.readFileSync(this.jsFilePath, 'utf-8');
            const context = { exports: {} };
            vm.runInNewContext(dynamicCode, context);
            const dynamicModule = context.exports as { compare: () => boolean };
    
            resolve(dynamicModule.compare());
          } catch (err) {
            console.log(err);
            reject(false);
          }
        });
      };

    run = async (file:string):Promise<boolean> => {
        try {
            await this.writeTsCodeToFile(file+ "\n" + this.achievement.generationFunction + "\n" + this.achievement.validationFunction + "\n" + this.achievement.compareFunction);
            await this.transpileTsCode();
            const result = await this.loadAndExecute();
            console.log(`TypeScript code has been written to ${this.tsFileName}`);
            return result;
        } catch (err) {
            console.error('Error:', (err as Error).message);
            return false;
        }
    };
}