import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../../../test-data/sharedData';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login(testUsers.validUser.username, testUsers.validUser.password);
    await loginPage.assertLoginSuccess();
  });

  test('should show error with invalid password', async () => {
    await loginPage.login(testUsers.validUser.username, testUsers.invalidUser.password);
    await loginPage.assertLoginError('invalidPassword');
  });

  test('should show error with invalid username', async () => {
    await loginPage.login(testUsers.invalidUser.username, testUsers.validUser.password);
    await loginPage.assertLoginError('invalidUsername');
  });

  test('should show error with empty credentials', async () => {
    await loginPage.login('', '');
    await loginPage.assertLoginError('requiredField');
  });
  
  test('should show correct error for each empty field', async () => {
    await loginPage.login(testUsers.validUser.username, '');
    await loginPage.assertLoginError('requiredField');
    
    await loginPage.login('', testUsers.validUser.password);
    await loginPage.assertLoginError('requiredField');
  });
});