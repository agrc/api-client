# Contributing to the UGRC API Client

![License](https://img.shields.io/github/license/agrc/api-client)

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

The following is a set of guidelines for contributing to the AGRC Organization on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [ugrc@utah.gov](mailto:ugrc@utah.gov).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

When you are creating a bug report, please include as many details as possible. Fill out the required template as the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

- **Perform a [cursory search](https://github.com/agrc/api-client/issues?q=is%3Aissue+sort%3Aupdated-desc+is%3Aopen+label%3Abug+)** to see if the problem has already been reported. If it has **and the issue is still open**, add a 👍 or a comment with more detail to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/).

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible. When listing steps, **don't say what you did, but explain how you did it**.
- **Provide the data that caused the failure if possible**.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and videos** which show you following the described steps and clearly demonstrate the problem.

Provide more context by answering these questions:

- **Did the problem start happening recently** (e.g. after updating to a new version) or was this always a problem?
- **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
- Is the problem is related to working with a specific file?

Include details about your configuration and environment:

- **Which version of the app are you using?** You can get the exact version by clicking on the version in the lower left corner of the app.
- **What's the name and version of the OS you're using**?

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

When you are creating an enhancement suggestion, please include as many details as possible. Include the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

- **Perform a [cursory search](https://github.com/agrc/api-client/issues?q=is%3Aissue+sort%3Aupdated-desc+label%3Aenhancement+is%3Aopen+)** to see if the enhancement has already been suggested. If it has, add a 👍 to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue providing the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful**.

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `good first issue` and `help-wanted` issues:

- [good first issue](https://github.com/agrc/api-client/labels/good%20first%20issue)- issues which should only require a few lines of code.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than `good first issue` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

#### Local development

The API Client can be developed locally.

- Clone the repository
- npm install
- npm start

### Pull Requests

The process described here has several goals:

- Maintain quality
- Fix problems that are important to users
- Engage the community in working toward the best possible app
- Enable a sustainable system for UGRC's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the style guide
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Style Guide

### Branch Names

Branch names are used for semantic versioning of the app and GitHub actions will label your pull request based on your branch name. The following convention is required for pull request branches.

| type                   | style    |
| ---------------------- | -------- |
| Bug fixes              | fix/\*   |
| Enhancements           | feat/\*  |
| Documentation          | docs/\*  |
| Testing                | test/\*  |
| Continuous integration | ci/\*    |
| CSS and UI Design      | style/\* |
| Maintenance            | chore/\* |

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move item to..." not "Moves item to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

All JavaScript code is formatted with [Prettier](https://prettier.io/) and linted with [eslint](https://eslint.org/).

Thanks! ❤️ ❤️ ❤️

UGRC
