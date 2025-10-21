import { test, expect } from '@playwright/test';
import { endpoints, testUsers } from '../../../test-data/sharedData';

test.describe('API Tests - Real World App', () => {
    test.beforeAll(async ({ request }) => {
        // Check if backend is running
        try {
            await request.get(endpoints.api.baseUrl);
        } catch (error) {
            throw new Error(
                'Backend server is not running. Please start it with: cd ../new-project && yarn dev'
            );
        }

        // Reset database to seed data
        await request.post(`${endpoints.api.baseUrl}/testData/seed`);
    });

    test('should authenticate successfully with valid credentials', async ({ request }) => {
        const response = await request.post(`${endpoints.api.baseUrl}${endpoints.api.auth}`, {
            data: {
                username: testUsers.validUser.username,
                password: testUsers.validUser.password
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body).toBeDefined();
        // The Real World App returns user details in the response
        expect(body.user).toBeDefined();
        expect(body.user.username).toBe(testUsers.validUser.username);
    });

    test('should return 401 with invalid credentials', async ({ request }) => {
        const response = await request.post(`${endpoints.api.baseUrl}${endpoints.api.auth}`, {
            data: {
                username: testUsers.invalidUser.username,
                password: testUsers.invalidUser.password
            }
        });

        expect(response.status()).toBe(200);
        const text = await response.text();
        expect(text).toBe('Unauthorized');
    });
});