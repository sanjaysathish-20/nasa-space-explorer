import React, { useState, useEffect } from 'react';

function MarsPhotos() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use environment variable for backend URL or fallback to localhost
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const fetchPhotos = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/mars-photos?page=${pageNum}`);
      if (!res.ok) throw new Error('Failed to fetch Mars photos');
      const data = await res.json();
      setPhotos(data.photos); // API returns `photos` array
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  return (
    <div>
      <h2>Mars Rover Photos (Sol 1000)</h2>
      {loading && <p>Loading photos...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.img_src}
            alt={`Mars rover ${photo.rover.name}`}
            style={{ width: '200px', borderRadius: '8px' }}
          />
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page: {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default MarsPhotos;
