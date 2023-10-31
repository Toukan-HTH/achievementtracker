import * as _vscode from "vscode";

declare global{
    const tsvscode: {
        postMessage: ({type:string,tag:string,value:any}) => void;
    };
}