// Test unit
const request = require('supertest');
const app = require('../../server.js'); // Import your Express app

test('the name of the user is Annelies Jakobs', async () => {
  const response = await request(app).get('/user/anneliesrj'); 
  
  // Check if the response status code is 200 
  expect(response.status).toBe(200);

  // Parse the response body as JSON
  const userData = JSON.parse(response.text);

  // Define the expected name
  const expectedName = 'Annelies Jakobs';

  // Check if the name in the response matches the expected name
  expect(userData.name).toBe(expectedName);
});
