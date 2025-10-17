/**
 * Custom error types for the test framework
 */

export class PageLoadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PageLoadError';
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type LoginErrorType = keyof typeof import('../../test-data/sharedData').errorMessages.ui;