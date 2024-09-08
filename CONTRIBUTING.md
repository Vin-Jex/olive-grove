# Contributing to the Olive Grove Project

Thank you for considering contributing to the Olive Grove Site Project! We welcome contributions of all kinds, including bug fixes, new features, documentation improvements, and more.

## Table of Contents
1. [How to Contribute](#how-to-contribute)
2. [Code of Conduct](#code-of-conduct)
3. [Reporting Bugs](#reporting-bugs)
4. [Suggesting Features](#suggesting-features)
5. [Submitting Changes](#submitting-changes)
6. [Style Guidelines](#style-guidelines)
7. [Commit Messages](#commit-messages)

## How to Contribute
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## Code of Conduct
We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the standards of behavior we expect from all contributors.

## Reporting Bugs
If you find a bug, please report it by opening an issue on GitHub. Include as much detail as possible to help us understand and address the issue. Be sure to include:
- Steps to reproduce the bug.
- Your environment (browser, operating system, etc.).
- Any relevant screenshots or logs.

## Suggesting Features
We welcome feature suggestions! If you have an idea, please open an issue on GitHub and describe:
- The problem your feature would solve.
- How you envision the feature working.
- Any additional context or details.

## Submitting Changes
Before submitting a pull request, please ensure that:
1. Your code follows our [Style Guidelines](#style-guidelines).
2. You have written tests for your changes, if applicable.
3. All tests pass and the code lints without errors.
4. Your commit messages follow our [Commit Messages](#commit-messages) guidelines.

## Style Guidelines
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some exceptions for TypeScript.
- Use meaningful variable and function names.
- Write clear and concise comments where necessary.
- Ensure code readability and maintainability.

### Linting and Formatting
We use ESLint for linting and Prettier for code formatting. Ensure your code passes both before committing:
```bash
npm run lint
npm run format
# or
yarn lint
yarn format
```

## Commit Messages
Please write descriptive commit messages that clearly explain the purpose of your changes. Follow these guidelines:
- Use the present tense ("Add feature" not "Added feature").
- Be concise but descriptive.
- Reference any relevant issues or pull requests.

### Example Commit Messages
- `Fix: Fix typo in README`
- `Feat: Add user authentication feature`
- `Refactor: Refactor header component for better readability`
- `Style: Style header component for satisfying feeling`
- `Perf: Update dependencies to latest versions`
- `Docs: Modify or Create Documentation for <anything>` 

Thank you for contributing! We appreciate your efforts in making the Olive Grove Project better for everyone.