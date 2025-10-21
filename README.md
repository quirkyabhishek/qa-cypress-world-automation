# QA Automation Project

This repository contains automated tests for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) using Playwright test framework.

## Prerequisites

- Node.js (refer to `.node-version` file for the exact version)
- Git
- Yarn Classic (v1.x)

## Getting Started

1. Clone this repository with submodules:
```bash
git clone https://github.com/quirkyabhishek/qa-automation-project.git
cd qa-automation-project
git submodule update --init --recursive
```

2. Install dependencies for the test project:
```bash
yarn install
```

3. Set up the Real World App:
```bash
cd webApp/cypress-realworld-app
yarn install
cd ../..
```

## Running Tests

### Start the Application

First, start the Real World App in one terminal:
```bash
cd webApp/cypress-realworld-app
yarn dev
```

### Run Tests

In another terminal, run the tests:
```bash
# Run all tests
yarn playwright test

# Run tests with UI mode
yarn playwright test --ui

# Run specific test file
yarn playwright test tests/api/specs/users.spec.ts
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