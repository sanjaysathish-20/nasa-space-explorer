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
    <div
      style={{
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#121212',
        color: '#eee',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Mars Rover Photos (Sol 1000)</h2>
      
      <p
        style={{
          textAlign: 'center',
          color: '#bbb',
          maxWidth: '600px',
          margin: '0 auto 1.5rem auto',
          fontSize: '1rem',
          lineHeight: '1.4',
        }}
      >
        Explore photos captured by NASA’s Mars Rover on Sol 1000 — a snapshot of the Martian surface
        showcasing rocks, terrain, and exploration paths. Use the pagination buttons to browse through
        the collection of stunning images from the Red Planet.
      </p>

      {loading && <p style={{ textAlign: 'center', color: '#bbb' }}>Loading photos...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.img_src}
            alt={`Mars rover ${photo.rover.name}`}
            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: page === 1 ? '#444' : '#0077cc',
            color: 'white',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => { if(page !== 1) e.currentTarget.style.backgroundColor = '#005fa3' }}
          onMouseOut={e => { if(page !== 1) e.currentTarget.style.backgroundColor = '#0077cc' }}
        >
          Previous
        </button>

        <span style={{ alignSelf: 'center', fontSize: '1rem' }}>Page: {page}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#0077cc',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#005fa3')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0077cc')}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MarsPhotos;
