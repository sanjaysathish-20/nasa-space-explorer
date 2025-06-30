import React, { useState } from 'react';
import axios from 'axios';

function ImageLibrary() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  const searchLibrary = async () => {
    if (!query) return;
    setLoading(true);
    setPage(1); // reset page on new search
    try {
      const res = await axios.get(`https://images-api.nasa.gov/search?q=${query}`);
      const items = res.data.collection.items || [];
      setResults(items);
    } catch (err) {
      console.error('Error fetching image library:', err);
      setResults([]);
    }
    setLoading(false);
  };

  // Calculate pagination slices
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#eee',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: 'center' }}>NASA Image & Video Library</h2>

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
        Search and explore an extensive collection of NASA’s images and videos from space missions, planets,
        stars, and more. Simply enter a keyword like “moon” or “mars” to discover amazing visual content
        from NASA’s public archives.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for 'moon', 'mars', etc."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '60%',
            padding: '0.5rem 1rem',
            borderRadius: '4px 0 0 4px',
            border: '1px solid #444',
            backgroundColor: '#222',
            color: '#eee',
            fontSize: '1rem',
            outline: 'none',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') searchLibrary();
          }}
        />
        <button
          onClick={searchLibrary}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '0 4px 4px 0',
            border: '1px solid #444',
            borderLeft: 'none',
            backgroundColor: '#0077cc',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005fa3')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0077cc')}
        >
          Search
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#bbb' }}>Loading...</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)', // 6 images per row
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        {paginatedResults.map((item, index) => {
          const image = item.links?.[0]?.href;
          const title = item.data?.[0]?.title;
          return image ? (
            <div
              key={index}
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#222',
              }}
            >
              <img src={image} alt={title} style={{ width: '100%', display: 'block' }} />
              <p
                style={{
                  fontSize: '0.9rem',
                  padding: '0.5rem',
                  margin: 0,
                  color: '#ccc',
                  textAlign: 'center',
                }}
              >
                {title}
              </p>
            </div>
          ) : null;
        })}
      </div>

      {/* Pagination Buttons */}
      {results.length > itemsPerPage && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: page === 1 ? '#555' : '#0077cc',
              color: 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Previous
          </button>

          <span style={{ color: '#ccc', alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: page === totalPages ? '#555' : '#0077cc',
              color: 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageLibrary;
