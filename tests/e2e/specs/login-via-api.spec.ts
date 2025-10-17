import { test, expect, APIRequestContext, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../../ui/pages/LoginPage';
import { endpoints, testUsers } from '../../../test-data/sharedData';

// Increase default timeout for state transitions
test.setTimeout(45000);

test.describe.serial('End-to-End Tests', () => {
    let loginPage: LoginPage;

    interface CustomWindow {
        authService?: {
            state?: {
                value?: string;
            };
            send?: Function;
        };
        Cypress?: boolean;
    }

    async function waitForAuthState(page: Page, expectedState: string, maxRetries = 10) {
        let retries = 0;
        while (retries < maxRetries) {
            const state = await page.evaluate(() => {
                return (window as unknown as CustomWindow).authService?.state?.value;
            });
            if (state === expectedState) {
                return true;
            }
            await page.waitForTimeout(1000);
            retries++;
        }
        return false;
    }

    test.beforeEach(async ({ page, request, context }: { page: Page, request: APIRequestContext, context: BrowserContext }) => {
        loginPage = new LoginPage(page);

        await page.addInitScript(() => {
            Object.defineProperty(window, 'Cypress', { value: true });
        });

        await context.clearCookies();
        
        // Navigate and wait for critical elements instead of networkidle
        await page.goto(endpoints.ui.baseUrl);
        await Promise.race([
            page.waitForLoadState('domcontentloaded'),
            page.waitForLoadState('load')
        ]);

        // More reliable way to wait for app initialization
        await page.waitForFunction(() => {
            return (window as unknown as CustomWindow).authService?.send instanceof Function;
        }, { 
            timeout: 15000,
            polling: 1000  // Poll less frequently
        });

        // Prepare user data
        const userData = {
            username: testUsers.validUser.username,
            password: testUsers.validUser.password,
            type: "LOGIN"
        };

        // Call login API and get the response
        const response = await request.post(`${endpoints.api.baseUrl}${endpoints.api.auth}`, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': endpoints.ui.baseUrl,
                'Accept': 'application/json'
            },
            data: userData
        });

        // Verify login success
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.user).toBeTruthy();

        // Extract and set cookie
        const headers = await response.headers();
        const setCookieHeader = headers['set-cookie'];
        expect(setCookieHeader).toBeTruthy();
        const cookieMatch = setCookieHeader.match(/connect\.sid=([^;]+)/);
        expect(cookieMatch).toBeTruthy();

        // Set the session cookie
        await context.addCookies([{
            name: 'connect.sid',
            value: cookieMatch![1],
            domain: 'localhost',
            path: '/',
            httpOnly: true
        }]);

        // Navigate to home to establish new session
        await page.goto(endpoints.ui.baseUrl);
        await page.waitForLoadState('networkidle');

        // Wait for auth service and trigger login
        await page.waitForFunction(() => {
            // @ts-ignore - window.authService is added by the app for testing
            return window.authService && window.authService.state;
        }, { timeout: 10000 });

        // Send login event
        await page.evaluate((event) => {
            // @ts-ignore - window.authService is added by the app for testing
            window.authService.send('LOGIN', event);
        }, { username: userData.username, password: userData.password });

        // Wait for authorized state
        const isAuthorized = await waitForAuthState(page, 'authorized');
        if (!isAuthorized) {
            throw new Error('Failed to reach authorized state');
        }
    });

    test('1 - should successfully log in via API', async ({ page }) => {
        // On mobile, need to click menu button to show sidebar
        if (page.viewportSize()!.width < 600) {
            await page.locator('[data-test="sidenav-toggle"]').click();
        }
        
        // Verify we are logged in by checking for logout button and user info
        await expect(page.locator('[data-test="sidenav-signout"]')).toBeVisible();
        await expect(page.locator('[data-test="sidenav-user-full-name"]')).toBeVisible();
        await expect(page.locator('[data-test="sidenav-username"]')).toBeVisible();
    });

    test('2 - should successfully log out', async ({ page, context }) => {
        // On mobile, need to click menu button to show sidebar
        if (page.viewportSize()!.width < 600) {
            await page.locator('[data-test="sidenav-toggle"]').click();
        }
        
        // Click logout button
        const signoutButton = page.locator('[data-test="sidenav-signout"]');
        await expect(signoutButton).toBeVisible();
        
        // Create a promise to wait for navigation
        const navigationPromise = page.waitForURL('**/signin', { timeout: 10000 });
        
        // Click the logout button
        await signoutButton.click();
        
        // Wait for page load and navigation
        await page.waitForLoadState('load');
        await navigationPromise;

        // Verify URL is /signin
        expect(page.url()).toContain('/signin');

        // Wait for unauthorized state
        const isUnauthorized = await waitForAuthState(page, 'unauthorized');
        expect(isUnauthorized).toBe(true);
        
        // Verify username input is visible (this is how Cypress checks it)
        await expect(page.locator('[data-test="signin-username"]')).toBeVisible({ timeout: 10000 });
    });
});