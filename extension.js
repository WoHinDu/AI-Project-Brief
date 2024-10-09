const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');
const minimatch = require('minimatch');

async function getCombinedContent(rootPath) {
    // Get settings
    const config = vscode.workspace.getConfiguration('aiProjectBrief');
    const filePatterns = config.get('filePatterns', []);
    const respectGitignore = config.get('respectGitignore', true);
    const customPrefixText = config.get('customPrefixText', '');
    const customSuffixText = config.get('customSuffixText', '');

    const gitignorePath = path.join(rootPath, '.gitignore');

    let ig = ignore();
    if (respectGitignore && fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        ig = ignore().add(gitignoreContent);
    }

    let combinedContent = customPrefixText ? customPrefixText + '\n\n' : '';

    async function processDirectory(dirPath) {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(rootPath, fullPath);

            if (respectGitignore && ig.ignores(relativePath)) {
                continue;
            }

            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else if (entry.isFile()) {
                let action = 'include'; // Default action

                // Check if the file matches any of the patterns
                for (const pattern of filePatterns) {
                    if (minimatch(relativePath, pattern.pattern)) {
                        action = pattern.action;
                        break;
                    }
                }

                switch (action) {
                    case 'include':
                        const content = await fs.promises.readFile(fullPath, 'utf8');
                        combinedContent += `\n\n=== FILE: ${relativePath} ===\n\n${content}`;
                        break;
                    case 'pathOnly':
                        combinedContent += `\n\n=== FILE: ${relativePath} ===\n`;
                        break;
                    case 'ignore':
                        // Do nothing
                        break;
                }
            }
        }
    }

    await processDirectory(rootPath);

    if (customSuffixText) {
        combinedContent += '\n\n' + customSuffixText;
    }

    return combinedContent.trim();
}

function activate(context) {
    let combineFilesCommand = vscode.commands.registerCommand('aiProjectBrief.combineFiles', async function () {
        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        try {
            const combinedContent = await getCombinedContent(workspaceFolder.uri.fsPath);

            // Create a new untitled document
            const document = await vscode.workspace.openTextDocument({
                content: combinedContent,
                language: 'text'
            });

            // Show the document in the editor
            await vscode.window.showTextDocument(document);

            vscode.window.showInformationMessage('Files combined successfully in a new unsaved file!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error combining files: ${error.message}`);
        }
    });

    let combineFilesToClipboardCommand = vscode.commands.registerCommand('aiProjectBrief.combineFilesToClipboard', async function () {
        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        try {
            const combinedContent = await getCombinedContent(workspaceFolder.uri.fsPath);

            // Copy to clipboard
            await vscode.env.clipboard.writeText(combinedContent);

            vscode.window.showInformationMessage('Combined files copied to clipboard!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error combining files: ${error.message}`);
        }
    });

    let editCustomTextsCommand = vscode.commands.registerCommand('aiProjectBrief.editCustomTexts', async function () {
        const config = vscode.workspace.getConfiguration('aiProjectBrief');
        const customPrefixText = config.get('customPrefixText', '');
        const customSuffixText = config.get('customSuffixText', '');

        const prefixText = await vscode.window.showInputBox({
            prompt: 'Enter custom prefix text',
            value: customPrefixText,
            multiline: true
        });

        const suffixText = await vscode.window.showInputBox({
            prompt: 'Enter custom suffix text',
            value: customSuffixText,
            multiline: true
        });

        if (prefixText !== undefined) {
            await config.update('customPrefixText', prefixText, vscode.ConfigurationTarget.Workspace);
        }
        if (suffixText !== undefined) {
            await config.update('customSuffixText', suffixText, vscode.ConfigurationTarget.Workspace);
        }

        vscode.window.showInformationMessage('Custom texts updated successfully!');
    });

    context.subscriptions.push(combineFilesCommand, combineFilesToClipboardCommand, editCustomTextsCommand);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
