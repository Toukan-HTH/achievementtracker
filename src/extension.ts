// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';


export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "achievementtracker" is now active!');

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"achievementtracker-sidebar",
		sidebarProvider
	  )
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('achievementtracker.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World2 from achievementtracker!');
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));
}

export function deactivate() {}
