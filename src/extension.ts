// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";

interface Dictionary {
  [word: string]: string;
}

const makeAbsPaths = (dictPathStr: string) => {
  if (fs.existsSync(dictPathStr)) {
    return dictPathStr;
  }
  if (vscode.workspace.workspaceFolders === undefined) {
    return dictPathStr;
  }
  const workspaceRoot = vscode.workspace.workspaceFolders[0];
  return path.join(workspaceRoot.uri.path, dictPathStr);
};

const makeDict = () => {
  const config = vscode.workspace.getConfiguration("simple-dictionary");
  const dictPathStr = config.dictPaths;
  if (dictPathStr === "") {
    return {} as Dictionary;
  }

  const userDict: Dictionary = {};
  const dictPathStrList = dictPathStr.split(",");

  for (const dictPathStr of dictPathStrList) {
    const stream = fs.createReadStream(makeAbsPaths(dictPathStr));
    const reader = readline.createInterface({ input: stream });

    reader.on("line", (row: string) => {
      const [word, meaning] = row.split("\t");
      userDict[word] = meaning;
    });
  }

  return userDict;
};

const userDict: Dictionary = makeDict();

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
