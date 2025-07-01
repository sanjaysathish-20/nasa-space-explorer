// src/components/SpaceWeather.js
import React, { useEffect, useState } from 'react';

function SpaceWeather() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/DONKI/notifications?type=ALL&api_key=DEMO_KEY`
        );
        const data = await response.json();
        setEvents(data.slice(0, 5)); // get recent 5 events
      } catch (error) {
        console.error('Error fetching space weather data:', error);
      }
    };

    fetchSpaceWeather();
  }, []);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '4rem auto',
      padding: '0 2rem',
      color: '#cbd5e1',
      fontFamily: "'Poppins', Arial, sans-serif",
    }}>
      <h2 style={{ fontSize: '2rem', color: '#3a86ff', marginBottom: '1rem' }}>Recent Space Weather Events</h2>
      {events.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map((event, index) => (
            <li key={index} style={{ marginBottom: '1.5rem', background: '#1e293b', padding: '1rem', borderRadius: '10px' }}>
              <h3 style={{ margin: 0, color: '#e2e8f0' }}>{event.messageType}</h3>
              <p style={{ margin: '0.5rem 0', color: '#94a3b8' }}>{event.messageBody.slice(0, 200)}...</p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Issued on: {new Date(event.messageIssueTime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading space weather events...</p>
      )}
    </div>
  );
}

export default SpaceWeather;
