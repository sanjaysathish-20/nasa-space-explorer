require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const NASA_API_KEY = process.env.NASA_API_KEY;

// 1. APOD - Astronomy Picture of the Day
app.get('/apod', async (req, res) => {
  try {
    const dateQuery = req.query.date ? `&date=${req.query.date}` : '';
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateQuery}`);
    res.json(response.data);
  } catch (error) {
    console.error('APOD fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch APOD' });
  }
});

// 2. Mars Rover Photos (sol 1000 fixed) with pagination
app.get('/mars-photos', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos', {
      params: {
        sol: 1000,
        page,
        api_key: NASA_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Mars photos fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Mars photos' });
  }
});

// 3. EPIC - Earth Polychromatic Imaging Camera
app.get('/epic', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('EPIC fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch EPIC images' });
  }
});

// 4. NeoWs - Near Earth Object Web Service (today's feed)
app.get('/neo', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed/today?api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('NeoWs fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch NeoWs data' });
  }
});

// 5. NASA Image and Video Library (search example "moon")
app.get('/library', async (req, res) => {
  try {
    const response = await axios.get('https://images-api.nasa.gov/search?q=moon&media_type=image');
    res.json(response.data);
  } catch (error) {
    console.error('Library fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch NASA library data' });
  }
});

// Optional: DONKI API
app.get('/donki', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/DONKI/notifications?api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('DONKI fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch DONKI data' });
  }
});

// Optional: Techport API (Example: Get project 1 details)
app.get('/techport', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/techport/api/projects/1?api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Techport fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Techport data' });
  }
});

// Optional: Exoplanet Archive (example query)
app.get('/exoplanet', async (req, res) => {
  try {
    // The Exoplanet Archive is typically accessed through a different API, here is a placeholder
    res.json({ message: 'Exoplanet archive endpoint - implement specific queries as needed' });
  } catch (error) {
    console.error('Exoplanet fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Exoplanet data' });
  }
});
app.get('/', (req, res) => {
  res.send('NASA Space Explorer API is running');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
