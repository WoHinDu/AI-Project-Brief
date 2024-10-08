# AI Project Brief: Codebase Consolidator for AI Assistants

Quickly combine and export your project files for easy sharing with AI assistants like ChatGPT.

## Features

- **Combine Files**: Merge multiple project files into a single document for easy sharing.
- **Copy to Clipboard**: Consolidate your project files and copy the result directly to your clipboard.
- **Customizable File Handling**: Configure how different file types are processed using glob patterns.
- **Gitignore Support**: Optionally respect your project's `.gitignore` file when combining files.
- **Custom Prompts**: Add custom prompts before and after the combined content to guide AI assistants.

## Usage

1. Open your project in VSCode.
2. Use one of the following commands:
   - `AI Project Brief: Combine Files`: Creates a new document with the combined project files.
   - `AI Project Brief: Combine Files to Clipboard`: Copies the combined project files to your clipboard.
   - `AI Project Brief: Edit Custom Prefix/Suffix Texts`: Set up custom prompts for AI assistants.

## Configuration

Customize the extension's behavior in your VSCode settings:

- `aiProjectBrief.filePatterns`: An array of objects specifying how to handle different file patterns:

  ```json
  [
    {
      "pattern": "**/*.js",
      "action": "include"
    },
    {
      "pattern": "**/*.md",
      "action": "pathOnly"
    },
    {
      "pattern": "node_modules/**",
      "action": "ignore"
    }
  ]
  ```

  Actions can be "include" (full content), "pathOnly" (just the file path), or "ignore".

- `aiProjectBrief.respectGitignore`: Boolean to determine whether to respect the `.gitignore` file (default: true).
- `aiProjectBrief.customPrefixText`: Custom prompt to insert at the beginning of the combined content.
- `aiProjectBrief.customSuffixText`: Custom prompt to insert at the end of the combined content.

## Why Use AI Project Brief?

- **Streamline Communication**: Quickly share your entire codebase or specific parts with AI assistants or team members.
- **Flexible Configuration**: Customize how your files are combined to focus on what matters most.
- **Time-Saving**: Eliminate the need to manually copy and paste multiple files when seeking AI assistance or code reviews.
- **Custom AI Prompts**: Tailor your interactions with AI assistants by including specific instructions or context.

## Custom Prompts for AI Assistants

The custom prefix and suffix texts serve as prompts for AI assistants, allowing you to:

- Provide context about your project
- Specify the type of assistance you need
- Set constraints or requirements for the AI's response
- Ask specific questions about your codebase
Example prefix prompt:

```
This is a Node.js project using Express. Please review the following code for best practices and potential improvements:
````

Example suffix prompt:

```
Based on the code above, can you suggest any optimizations for performance? Also, are there any security concerns I should address?
````

## Requirements

- VSCode version 1.75.0 or higher

## Extension Settings

This extension contributes the following settings:

- `aiProjectBrief.filePatterns`: Specify how different file patterns should be handled
- `aiProjectBrief.respectGitignore`: Respect .gitignore when combining files
- `aiProjectBrief.customPrefixText`: Custom prompt to insert at the beginning of the combined content
- `aiProjectBrief.customSuffixText`: Custom prompt to insert at the end of the combined content

## Known Issues

Please report any issues on the GitHub repository.
