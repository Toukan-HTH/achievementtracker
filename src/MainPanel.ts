import * as vscode from "vscode";
import { getNonce } from "./GetNonce";
import {run} from "./AchievementTest"
import { SidebarProvider } from "./SidebarProvider";
import {achievements} from "./AchievementStorage";

export class MainPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: MainPanel | undefined;

  public static readonly viewType = "hello-world";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private provider: SidebarProvider;
  static panelName: string;

  public static async sendMessage(message:string){
    console.log("were in the MainPanel file");
    MainPanel.currentPanel?._panel.webview.postMessage({
      type:"loadPanel",
      value: message,
    });
    //this.currentPanel?.provider.addAchievementToStorage(3);
    //this.currentPanel?.provider.addCollectionToStorage(5);
    //await this.currentPanel?.provider.removeAchievementFromStorage(0);
    //await this.currentPanel?.provider.removeAchievementFromStorage(1);
    //await this.currentPanel?.provider.removeAchievementFromStorage(2);
    //await this.currentPanel?.provider.removeAchievementFromStorage(3);
    //await this.currentPanel?.provider.removeAchievementFromStorage(5);

    //await this.currentPanel?.provider.removeCollectionFromStorage(0);
    //await this.currentPanel?.provider.removeCollectionFromStorage(1);
    //await this.currentPanel?.provider.removeCollectionFromStorage(2);
    //await this.currentPanel?.provider.removeCollectionFromStorage(3);
    //await this.currentPanel?.provider.removeCollectionFromStorage(5);



    //console.log("[MainPanel] ach should be populated: " + ach?.then(res => {console.log("it is populated: " + res.toString())}),);
    /*MainPanel.currentPanel?._panel.webview.postMessage({
      type:"initAchievementSub",
      value: ach?.then(res => {return res.toString()}),
    });
    MainPanel.currentPanel?._panel.webview.postMessage({
      type:"initCollectionSub",
      value:  col?.then(res => {return res.toString()}),
    });*/
  }

  private updateSidebarProvider(_id:number, _result:boolean){
    console.log("in hellowrold panel too, id is:" + _id + " boolean is : " + _result);
    if(_result){
      this.provider.sendMessage("updateAchievement",_id);
    }
  }

  public static createOrShow(extensionUri: vscode.Uri, provider:SidebarProvider, _panelName:string) {
    console.log("creating "+ _panelName + " panel...");
    MainPanel.panelName=_panelName;
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    /*if (MainPanel.currentPanel) {
      MainPanel.currentPanel._panel.reveal(column);
      MainPanel.currentPanel._update();
      return;
    }*/

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      MainPanel.viewType,
      _panelName,
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    MainPanel.currentPanel = new MainPanel(panel, extensionUri,provider);
  }

  public static kill() {
    MainPanel.currentPanel?.dispose();
    MainPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri,provider:SidebarProvider) {
    MainPanel.currentPanel = new MainPanel(panel, extensionUri,provider);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri,provider:SidebarProvider) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this.provider = provider;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    // this._panel.webview.onDidReceiveMessage(
    //   (message) => {
    //     switch (message.command) {
    //       case "alert":
    //         vscode.window.showErrorMessage(message.text);
    //         return;
    //     }
    //   },
    //   null,
    //   this._disposables
    // );
  }

  public dispose() {
    MainPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "testAchievement": {
          console.log("in "+ MainPanel.panelName + " panel, id is: " + data.tag);
          //this.updateSidebarProvider(+data.tag,true);
          this.updateSidebarProvider(+data.tag,await achievements.filter((achievement) => achievement.achievement.id==+data.tag)[0].run(data.value))
        }

        case "removeAchievement":{

        }
        case "removeCollection":{
        }

        case "addAchievement":{

        }

        case "addCollection":{
          //console.log("[MainPanel] adding collection to local storage...");

        }

        case "testStorage": {

          //this.provider.addAchievementToStorage(0);
          //this.provider.addAchievementToStorage(1);
          //this.provider.addAchievementToStorage(2);

          //console.log(await this.provider.getSubscribedAchievements());
          //this.provider.removeAchievementFromStorage(0);
          //console.log(await this.provider.getSubscribedAchievements());
          //this.provider.removeAchievementFromStorage(0);
          //console.log("this should be an empty array idk")
          //console.log(this.provider.getSubscribedAchievements());
        }
        // case "tokens": {
        //   await Util.globalState.update(accessTokenKey, data.accessToken);
        //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
        //   break;
        // }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", MainPanel.panelName+".js")
    );


    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "reset.css"
      ));
    const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "vscode.css"
      ));
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", MainPanel.panelName+".css")
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en" style="height:100%;">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
      webview.cspSource
    }; script-src 'nonce-${nonce}';">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${stylesMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
        </script>
        <style>
        body {
          height:100%;
        }
        </style>
			</head>
        <body>
	    </body>
        <script src="${scriptUri}" nonce="${nonce}">
		</html>`;
  }
}