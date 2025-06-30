import React, { useEffect, useState } from 'react';
import './Home.css';

// Import all background images from ../images folder
const importAll = (r) => r.keys().map(r);
const backgrounds = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

// Base URL from environment or fallback
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [naturalEvents, setNaturalEvents] = useState([]);
  const [naturalIndex, setNaturalIndex] = useState(0);
  const [insightWeather, setInsightWeather] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);

  // Fetch DONKI alerts (space weather)
  const fetchSpaceWeather = async () => {
    try {
      const res = await fetch(`${BASE_URL}/donki`);
      const data = await res.json();
      setEvents(data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching DONKI alerts:', error);
    }
  };

  // Fetch EONET natural events
  const fetchEONET = async () => {
    try {
      const res = await fetch(`${BASE_URL}/eonet-events`);
      const data = await res.json();
      console.log('EONET data fetched:', data);  // Debug log
      if (data?.events && data.events.length > 0) {
        setNaturalEvents(data.events);
        setNaturalIndex(0); // Reset index on new data
      } else {
        setNaturalEvents([]);
      }
    } catch (error) {
      console.error('Error fetching EONET events:', error);
      setNaturalEvents([]);
    }
  };

  // Fetch Insight Mars Weather data
  const fetchInsightWeather = async () => {
    setLoadingInsight(true);
    setInsightError(null);
    try {
      const res = await fetch(`${BASE_URL}/insight-weather`);
      if (!res.ok) throw new Error('Failed to fetch Insight Mars Weather data');
      const data = await res.json();
      const solKeys = data['sol_keys'];
      if (solKeys?.length > 0) {
        const latestSol = solKeys[solKeys.length - 1];
        setInsightWeather({ sol: latestSol, ...data[latestSol] });
      } else {
        setInsightError('No sol data found');
      }
    } catch (err) {
      setInsightError(err.message || 'Unknown error');
    } finally {
      setLoadingInsight(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchSpaceWeather();
    fetchEONET();
    fetchInsightWeather();
  }, []);

  // Rotate background image every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // EONET event navigation handlers
  const handleNext = () =>
    setNaturalIndex((prevIndex) => (prevIndex + 1) % naturalEvents.length);

  const handlePrev = () =>
    setNaturalIndex((prevIndex) =>
      (prevIndex - 1 + naturalEvents.length) % naturalEvents.length
    );

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
      key={bgIndex}
    >
      <h1 className="home-title">Welcome to NASA Space Explorer</h1>
      <p className="home-subtitle">
        Discover the wonders of the universe through real NASA data and imagery.
      </p>

      {/* DONKI Space Weather Alerts */}
      <div className="space-weather-ticker">
        <h2>Latest Space Weather Alerts</h2>
        <div className="ticker-wrapper">
          <div className="ticker-move">
            {events.map((event, idx) => (
              <span key={idx} className="ticker-item">
                {event.messageType}: {event.messageBody.slice(0, 80)}...
              </span>
            ))}
          </div>
        </div>
        <div className="view-btn-wrapper">
          <button
            onClick={() => setSelectedEvent(events[0])}
            className="view-details-btn"
            disabled={!events.length}
          >
            View Details
          </button>
        </div>
      </div>

      {/* EONET Natural Events */}
      <div className="eonet-event">
        <h3>Latest Natural Events (EONET)</h3>
        {naturalEvents.length > 0 ? (
          <>
            <p>{naturalEvents[naturalIndex]?.title}</p>
            <p className="info">
              Category: {naturalEvents[naturalIndex]?.categories?.[0]?.title || 'N/A'}
            </p>
            <p className="info">
              Started: {naturalEvents[naturalIndex]?.geometry?.[0]?.date?.split('T')[0] || 'N/A'}
            </p>
            <div className="view-btn-wrapper" style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handlePrev} className="view-details-btn" aria-label="Prev">
                &larr;
              </button>
              <button
                onClick={() => setSelectedEvent(naturalEvents[naturalIndex])}
                className="view-details-btn"
              >
                View Details
              </button>
              <button onClick={handleNext} className="view-details-btn" aria-label="Next">
                &rarr;
              </button>
            </div>
          </>
        ) : (
          <p>No natural events data available at the moment.</p>
        )}
      </div>

      {/* Insight Mars Weather */}
      <div className="insight-weather">
        <h3>Insight Mars Weather Service</h3>
        {loadingInsight && <p>Loading Mars weather data...</p>}
        {insightError && <p className="error">{insightError}</p>}
        {insightWeather && !loadingInsight && !insightError && (
          <>
            <p>Sol (Mars day): {insightWeather.sol}</p>
            <p>Average Temperature: {insightWeather.AT?.av} °C</p>
            <p>Max Temperature: {insightWeather.AT?.mx} °C</p>
            <p>Min Temperature: {insightWeather.AT?.mn} °C</p>
            <p>Wind Speed: {insightWeather.HWS?.av} m/s</p>
            <p>Pressure: {insightWeather.PRE?.av} Pa</p>
            <p>Season: {insightWeather.Season}</p>
          </>
        )}
      </div>

      {/* Modal for selected event details */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setSelectedEvent(null)} className="modal-close-btn">
              ✕
            </button>
            {selectedEvent.messageType ? (
              <>
                <h2>{selectedEvent.messageType}</h2>
                <p>{selectedEvent.messageBody}</p>
                <p className="modal-info">
                  Issued: {new Date(selectedEvent.messageIssueTime).toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.description || 'No description available.'}</p>
                <p className="modal-info">
                  Category: {selectedEvent.categories?.[0]?.title || 'N/A'}
                </p>
                <p className="modal-info">
                  Date: {selectedEvent.geometry?.[0]?.date?.split('T')[0] || 'N/A'}
                </p>
                <p className="modal-info">
                  Coordinates: {selectedEvent.geometry?.[0]?.coordinates?.join(', ') || 'N/A'}
                </p>
                <a
                  href={selectedEvent.sources?.[0]?.url || selectedEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link"
                >
                  Source
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
