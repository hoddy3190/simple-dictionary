// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

interface Dictionary {
  [word: string]: string;
}

const userDict: Dictionary = { HELLO: "hello", FUGA: "fuga" };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "simple-dictionary" is now active!'
  );

  const disposable = vscode.languages.registerHoverProvider(["*"], {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);

      if (word in userDict) {
        return new vscode.Hover({
          language: "",
          value: userDict[word],
        });
      }
    },
  });

  context.subscriptions.push(disposable);
}
