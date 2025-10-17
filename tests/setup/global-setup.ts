import { FullConfig } from '@playwright/test';
import axios from 'axios';
import { endpoints } from '../../test-data/sharedData';

async function globalSetup(config: FullConfig) {
  // Check if backend is running
  try {
    const response = await axios.get(`${endpoints.api.baseUrl}`);
    console.log('Backend is running:', response.data);
  } catch (error) {
    console.error('Backend is not running. Please start it with `cd ../new-project && yarn dev`');
    process.exit(1);
  }

  // Reset database to seed data
  try {
    const response = await axios.post(`${endpoints.api.baseUrl}/testData/seed`);
    console.log('Database seeded:', response.data);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
}

export default globalSetup;