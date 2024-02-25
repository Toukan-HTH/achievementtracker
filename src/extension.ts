// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MainPanel } from './MainPanel';
import { SidebarProvider } from './SidebarProvider';


export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "achievementtracker" is now active!');

	const sidebarProvider = new SidebarProvider(context.extensionUri, context);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"achievementtracker-sidebar",
		sidebarProvider
	  )
	);

}

export function deactivate() {}
