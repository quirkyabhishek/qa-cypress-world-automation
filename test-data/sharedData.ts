/**
 * Shared test data and session information for test automation
 */

/** Response type for authentication requests */
export interface AuthResponse {
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        balance: number;
    };
    token: string;
}

/** Transaction data structure */
export interface Transaction {
    id: string;
    amount: number;
    description: string;
    receiverId: string;
    senderId: string;
    status: string;
}

export const testUsers = {
    validUser: {
        username: 'Heath93',
        password: 's3cret',
        id: 'qywYhB50P', // Heath93's actual user ID in the Real World App
    },
    validUser2: {
        username: 'Katharina_Bernier',
        password: 's3cret',
        id: '5', // Katharina_Bernier's actual user ID in the Real World App
    },
    invalidUser: {
        username: 'invaliduser',
        password: 'wrongpassword',
    }
} as const;

export const testTransactions = {
    new: {
        amount: 100,
        description: "Test payment",
        recipientId: 2,  // Arely_Kertzmann24's ID
        source: "free",
        privacyLevel: "public"
    }
} as const;

export const endpoints = {
    ui: {
        baseUrl: 'http://localhost:3000',
        loginPage: '/signin',
        signupPage: '/signup',
        homePage: '/',
        transactionsPage: '/transactions',
        userSettingsPage: '/user/settings'
    },
    api: {
        baseUrl: 'http://localhost:3001',
        auth: '/login',
        transactions: '/transactions',
        transfer: '/bankTransfers',
        contacts: '/contacts',
        bankAccounts: '/bankAccounts',
        notifications: '/notifications',
        users: '/users'
    }
} as const;

export const errorMessages = {
    ui: {
        invalidPassword: 'Username or password is invalid',
        invalidUsername: 'Username or password is invalid',
        loginRequired: 'Please sign in to continue',
        requiredField: 'Username is required',
        requiredPassword: 'Password is required'
    },
    api: {
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        notFound: 'Not found',
        invalidRequest: 'Bad request'
    }
} as const;