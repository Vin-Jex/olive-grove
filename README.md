# Olive Grove Project - Development README

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Teams and Responsibilities](#teams-and-responsibilities)
4. [Getting Started](#getting-started)
5. [Branching Strategy](#branching-strategy)
6. [Coding Guidelines](#coding-guidelines)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [Contact](#contact)

## Project Overview
Olive Grove Project is a school website that provides students, teachers, and parents with a comprehensive platform for managing academic activities, resources, and communications. Built with Next.js, TypeScript, and Tailwind CSS, the project aims to deliver a seamless and engaging user experience, fostering an environment conducive to effective learning and collaboration.

## Tech Stack
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Version Control**: Git and GitHub

## Teams and Responsibilities
### Team 1: Frontend Development
- Responsible for building the user interface using React components.
- Implementing responsive design with Tailwind CSS.
- Ensuring accessibility and cross-browser compatibility.

### Team 2: Backend Development
- Setting up Node.js API routes.
- Integrating with external APIs.
- Managing database connections and data flow.

### Team 3: Quality Assurance and Testing
- Writing and maintaining unit and integration tests.
- Performing code reviews and ensuring code quality.
- Conducting user acceptance testing (UAT) and bug tracking.

## Getting Started
### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-website.git
   cd school-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Branching Strategy
- **Main Branch**: Protected branch. Only the release manager can merge into this branch.
- **Develop Branch**: Integration branch for feature branches.
- **Feature Branches**: Branch off from `develop` for new features or bug fixes. Naming convention: `feature/feature-name`.
- **Hotfix Branches**: Branch off from `main` for urgent fixes. Naming convention: `hotfix/hotfix-name`.

### Creating a Branch
```bash
git checkout -b feature/your-feature-name
```

### Merging a Branch
1. Create a pull request (PR) to `develop` branch.
2. At least one team member must review the PR.
3. Once approved, the release manager merges the PR.

## Coding Guidelines
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some exceptions for TypeScript.
- Use meaningful variable and function names.
- Write clear and concise comments where necessary.
- Ensure code readability and maintainability.

### Linting and Formatting
- We use ESLint for linting and Prettier for code formatting. Ensure your code passes both before committing.
  ```bash
  npm run lint
  npm run format
  # or
  yarn lint
  yarn format
  ```

## Deployment
- Deployment is handled through Vercel.
- Ensure all tests pass and code is reviewed before deploying.
- Follow the [deployment guide](docs/deployment.md) for detailed steps.

## Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/feature-name`).
5. Open a pull request.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for more details on our code of conduct and the process for submitting pull requests.

## Contact
For any questions or suggestions, feel free to reach out to the team leads:
- **Frontend Lead**: vincentcode0@gmail.com
- **Backend Lead**: vincentcode0@gmail.com
- **QA Lead**: vincentcode0@gmail.com

Happy coding!

---

This README provides a comprehensive guide to Olive Grove Project's development workflow, ensuring all team members are aligned and can contribute effectively.# olive-grove
