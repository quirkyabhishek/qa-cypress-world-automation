import axios from 'axios';
import { endpoints } from '../../test-data/sharedData';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function startBackend() {
    try {
        // Try to make a request to see if backend is already running
        await axios.get(`${endpoints.api.baseUrl}`);
        console.log('Backend is already running');
        return;
    } catch (error) {
        console.log('Backend is not running, starting it...');
    }

    // Start the backend
    const command = 'cd ../new-project && yarn dev';
    const child = await execAsync(command);
    
    // Wait for the backend to be ready
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
        try {
            await axios.get(`${endpoints.api.baseUrl}`);
            console.log('Backend is now running');
            return;
        } catch (error) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    throw new Error('Backend failed to start');
}

export async function seedTestData() {
    try {
        const response = await axios.post(`${endpoints.api.baseUrl}/testData/seed`);
        console.log('Database seeded successfully');
        return response.data;
    } catch (error) {
        console.error('Failed to seed database:', error);
        throw error;
    }
}