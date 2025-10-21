# QA Automation Project

This repository contains automated tests for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) using Playwright test framework.

## Prerequisites

- Node.js (refer to `.node-version` file for the exact version)
- Git
- npm (latest version)

## Getting Started

1. Clone this repository with submodules:
```bash
git clone https://github.com/quirkyabhishek/qa-automation-project.git
cd qa-automation-project
git submodule update --init --recursive
```

2. Install dependencies for the test project:
```bash
npm ci
```

3. Install Playwright browsers:
```bash
npx playwright install --with-deps
```

4. Set up the Real World App:
```bash
cd webApp/cypress-realworld-app
npm install
cd ../..
```

## Running Tests

### Start the Application

Start the Real World App:

```bash
cd webApp/cypress-realworld-app
yarn dev
```

This single command starts both the backend and frontend services.

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

> **Note**: The default user credentials are:
> - Username: `Katharina_Bernier`
> - Password: `s3cret`

### Run Tests

In a new terminal, you can run tests using the following commands:

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test file
npx playwright test tests/api/specs/users.spec.ts

# Run tests with headed browsers
npx playwright test --headed
```

## Test Reports

### Allure Reports
After running tests, generate and view the Allure report:
```bash
yarn allure:generate
yarn allure:open
```

### Playwright Reports
Playwright automatically generates HTML reports after test runs. Find them in:
- `playwright-report/` directory
- `test-results/` directory for test artifacts

## Project Structure

```
qa-automation-project/
├── tests/
│   ├── api/            # API tests
│   │   └── specs/
│   └── ui/            # UI tests
│       ├── pages/     # Page objects
│       └── specs/     # Test specifications
├── test-data/         # Test data and configurations
├── webApp/
│   └── cypress-realworld-app/  # The application under test
└── playwright.config.ts        # Playwright configuration
```

## GitHub Actions

The project uses GitHub Actions for CI/CD. On each push and pull request:
1. The Real World App is started
2. All tests are executed
3. Test reports are generated and uploaded as artifacts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Notes

- Test reports (allure-report/, allure-results/, playwright-report/, etc.) are excluded from git tracking
- The Real World App is included as a git submodule for better version control
- Tests run against the dev server on port 3000 (frontend) and 3001 (backend)