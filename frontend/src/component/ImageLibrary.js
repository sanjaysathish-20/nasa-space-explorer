import React, { useState } from 'react';
import axios from 'axios';

function ImageLibrary() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLibrary = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://images-api.nasa.gov/search?q=${query}`);
      const items = res.data.collection.items;
      setResults(items);
    } catch (err) {
      console.error('Error fetching image library:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>NASA Image & Video Library</h2>
      <input
        type="text"
        placeholder="Search for 'moon', 'mars', etc."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchLibrary}>Search</button>

      {loading && <p>Loading...</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
        {results.map((item, index) => {
          const image = item.links?.[0]?.href;
          const title = item.data?.[0]?.title;
          return image ? (
            <div key={index} style={{ width: '200px' }}>
              <img src={image} alt={title} style={{ width: '100%' }} />
              <p style={{ fontSize: '0.9rem' }}>{title}</p>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export default ImageLibrary;
