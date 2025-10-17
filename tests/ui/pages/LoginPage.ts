import { Page, Locator, expect } from '@playwright/test';
import { endpoints, errorMessages } from '../../../test-data/sharedData';
import { PageLoadError, AuthenticationError, ValidationError, LoginErrorType } from '../../types/errors';

/**
 * Page object representing the login page functionality
 * Handles authentication flows and login-related assertions
 */
export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('[data-test="signin-submit"]');
        this.errorMessage = page.locator('[data-test="signin-error"]');
        this.logoutButton = page.locator('[data-test="sidenav-signout"]');
    }

    /**
     * Navigates to the login page and ensures it's ready for interaction
     * @throws {Error} If login page elements are not visible
     */
    async goto() {
        try {
            await this.page.goto(endpoints.ui.baseUrl + endpoints.ui.loginPage, {
                waitUntil: 'networkidle'
            });
            
            await Promise.all([
                this.usernameInput.waitFor({ state: 'visible' }),
                this.passwordInput.waitFor({ state: 'visible' }),
                this.loginButton.waitFor({ state: 'visible' })
            ]);
        } catch (error: any) {
            const message = error?.message || 'Unknown error';
            throw new Error(`Failed to load login page: ${message}`);
        }
    }

    async login(username: string, password: string) {
        await this.usernameInput.clear();
        await this.usernameInput.fill(username);
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
        if (!username || !password) {
            // For empty credential tests, don't wait for navigation
            await this.loginButton.click({ timeout: 1000 }).catch(() => {});
            return;
        }
        
        // Click the login button without waiting for a specific response
        await this.loginButton.click();
        
        // Wait for either sign-out button (successful login) or error message
        try {
            await Promise.race([
                this.page.waitForSelector('[data-test="sidenav-signout"]', { state: 'visible', timeout: 10000 }),
                this.page.waitForSelector('[data-test="signin-error"]', { state: 'visible', timeout: 10000 })
            ]);

            // Let the DOM stabilize
            await this.page.waitForTimeout(1000);

            // Check for success indicators
            if (await this.logoutButton.isVisible()) {
                // Additional successful login indicators
                await this.page.waitForSelector('[data-test="sidenav-user-full-name"]', { state: 'visible', timeout: 5000 });
                await this.page.waitForSelector('[data-test="sidenav-user-balance"]', { state: 'visible', timeout: 5000 });
            }
        } catch (error) {
            // If timeout occurs, assume failed login
            await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        }
    }

    /**
     * Verifies successful login by checking navigation and user interface elements
     * @throws {Error} If login success indicators are not found
     */
    async assertLoginSuccess() {
        await expect(this.page.url()).toBe(endpoints.ui.baseUrl + endpoints.ui.homePage);
        await expect(this.logoutButton).toBeVisible();
        await expect(this.page.locator('[data-test="sidenav-user-full-name"]')).toBeVisible();
        await expect(this.page.locator('[data-test="sidenav-user-balance"]')).toBeVisible();
        await expect(this.page.locator('[data-test="transaction-list"]')).toBeVisible();
    }

    async assertLoginError(error: keyof typeof errorMessages.ui) {
        if (error === 'requiredField') {
            const usernameHelper = this.page.locator('#username-helper-text');
            const passwordHelper = this.page.locator('#password-helper-text');
            
            if (await usernameHelper.isVisible()) {
                await expect(usernameHelper).toContainText('Username is required');
            } else if (await passwordHelper.isVisible()) {
                await expect(passwordHelper).toContainText('Password is required');
            }
        } else {
            await expect(this.errorMessage).toContainText('Username or password is invalid');
        }
        await expect(this.page.url()).toContain(endpoints.ui.loginPage);
    }

    async logout() {
        await this.logoutButton.click();
        await this.page.waitForURL(endpoints.ui.baseUrl + endpoints.ui.loginPage);
        await expect(this.loginButton).toBeVisible();
    }
}