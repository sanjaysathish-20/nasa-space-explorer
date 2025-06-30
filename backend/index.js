require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const NASA_API_KEY = process.env.NASA_API_KEY;

// Root route
app.get('/', (req, res) => {
  res.send('NASA Space Explorer API is running');
});

// 1. Astronomy Picture of the Day (APOD)
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

// 2. Mars Rover Photos (sol 1000 with pagination)
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

// 4. Near Earth Objects (NeoWs)
app.get('/neo', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed/today?detailed=true&api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('NeoWs fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch NeoWs data' });
  }
});

// 5. NASA Image and Video Library
app.get('/library', async (req, res) => {
  try {
    const query = req.query.q || 'moon';
    const response = await axios.get(`https://images-api.nasa.gov/search?q=${query}&media_type=image`);
    res.json(response.data);
  } catch (error) {
    console.error('Library fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch NASA library data' });
  }
});

// 6. DONKI API - Space weather notifications
app.get('/donki', async (req, res) => {
  try {
    const startDate = req.query.startDate || '2024-01-01';
    const response = await axios.get(`https://api.nasa.gov/DONKI/notifications`, {
      params: {
        startDate,
        api_key: NASA_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('DONKI fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch DONKI data' });
  }
});

// 7. Insight Mars Weather API - latest Mars weather data
app.get('/insight', async (req, res) => {
  try {
    const response = await axios.get('https://api.nasa.gov/insight_weather/', {
      params: {
        api_key: NASA_API_KEY,
        feedtype: 'json',
        ver: '1.0',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Insight Mars Weather fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Insight Mars Weather data' });
  }
});

// 8. EONET - Earth Observatory Natural Event Tracker
app.get('/eonet', async (req, res) => {
  try {
    const limit = req.query.limit || 10;  // optional limit param
    const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events', {
      params: {
        limit,
        status: 'open',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('EONET fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch EONET data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NASA Space Explorer API running on port ${PORT}`);
});
