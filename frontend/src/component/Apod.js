import React, { useState, useEffect } from 'react';
import StyledDatePicker from './StyledDatePicker';

function Apod() {
  const [apod, setApod] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApod = async (selectedDate = '') => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : '';
      const dateParam = formattedDate ? `?date=${formattedDate}` : '';
      const res = await fetch(`http://localhost:5000/apod${dateParam}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApod(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApod(date);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchApod(newDate);
  };

  return (
    <div>
      <h2>🌌 Astronomy Picture of the Day</h2>
      <StyledDatePicker
        selectedDate={date}
        onChange={handleDateChange}
        label="Select a date"
      />

      {loading && <p>Loading APOD...</p>}
      {error && <p>Error: {error}</p>}

      {apod && !loading && !error && (
        <>
          <h3>{apod.title}</h3>
          <img
            src={apod.url}
            alt={apod.title}
            style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '1rem' }}
          />
          <p style={{ marginTop: '1rem' }}>{apod.explanation}</p>
        </>
      )}
    </div>
  );
}

export default Apod;
