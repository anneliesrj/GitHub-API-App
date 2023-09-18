// server.js
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3001;

// Use helmet middleware
app.use(helmet());

// Route to fetch user details
app.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }
    
    const data = await response.json();
    
    // Set the Content-Type header to indicate JSON response
    res.setHeader('Content-Type', 'application/json');
    
    // Send the JSON data as a response
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch user repositories
app.get('/user/:username/repos', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    
    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }
    
    const reposData = await response.json();
    
    // Set the Content-Type header to indicate JSON response
    res.setHeader('Content-Type', 'application/json');
    
    // Send the JSON data as a response
    res.send(JSON.stringify(reposData, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
