import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StyledDatePicker from './StyledDatePicker';

function Epic() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date('2023-06-01'));
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchEpicImages = async () => {
      setLoading(true);
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const res = await axios.get(`https://api.nasa.gov/EPIC/api/natural/date/${formattedDate}?api_key=DEMO_KEY`);
        const baseURL = `https://epic.gsfc.nasa.gov/archive/natural/${formattedDate.replace(/-/g, '/')}/jpg/`;

        const formatted = res.data.map(img => ({
          id: img.identifier,
          date: img.date,
          imageUrl: `${baseURL}${img.image}.jpg`
        }));

        setImages(formatted);
      } catch (err) {
        console.error('Failed to fetch EPIC images:', err);
        setImages([]);
      }
      setLoading(false);
    };

    fetchEpicImages();
  }, [date]);

  const getTimeOnly = (dateStr) => {
    if (!dateStr) return 'Invalid date';
    const isoDateStr = dateStr.replace(' ', 'T');
    const d = new Date(isoDateStr);
    if (isNaN(d)) return 'Invalid date';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h2 style={{ color: '#eee', textAlign: 'center' }}>Earth Polychromatic Imaging Camera (EPIC)</h2>

      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0.5rem auto 1rem auto' }}>
        <p style={{ color: '#ccc', margin: 0 }}>
          This component displays natural color images of Earth taken by NASA's EPIC instrument aboard the DSCOVR satellite. 
          Select a date to view the available images captured on that day, including their capture time.
        </p>
      </div>

      <StyledDatePicker
        selectedDate={date}
        onChange={setDate}
        label="Select Date"
        minDate={new Date('2015-06-13')}
        maxDate={new Date()}
      />

      {loading ? (
        <p style={{ color: '#aaa' }}>Loading EPIC images...</p>
      ) : images.length === 0 ? (
        <p style={{ color: '#aaa' }}>No images found for this date.</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginTop: '1rem',
              cursor: 'pointer',
            }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImg(img)}
                style={{
                  border: '1px solid #444',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#222',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                <img
                  src={img.imageUrl}
                  alt={`EPIC image ${img.id}`}
                  style={{ width: '100%', display: 'block', filter: 'brightness(0.9)' }}
                />
                <div style={{ padding: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
                  <p><strong>ID:</strong> {img.id}</p>
                  <p><strong>Time:</strong> {getTimeOnly(img.date)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedImg && (
            <div
              onClick={() => setSelectedImg(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#121212cc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer',
                padding: '1rem',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '50vw',
                  maxHeight: '50vh',
                  position: 'relative',
                  textAlign: 'center',
                  backgroundColor: '#222',
                  borderRadius: '10px',
                  overflowY: 'auto',
                  padding: '1rem',
                  color: '#eee',
                  cursor: 'default',
                }}
              >
                <button
                  onClick={() => setSelectedImg(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#eee',
                    cursor: 'pointer',
                  }}
                  aria-label="Close modal"
                >
                  &times;
                </button>

                <img
                  src={selectedImg.imageUrl}
                  alt={`EPIC large ${selectedImg.id}`}
                  style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px', filter: 'brightness(0.95)' }}
                />

                <div style={{ marginTop: '0.5rem' }}>
                  <p><strong>ID:</strong> {selectedImg.id}</p>
                  <p><strong>Time:</strong> {getTimeOnly(selectedImg.date)}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Epic;
