import React, { useEffect, useState } from 'react';
import './Home.css';

// Helper function to import all images from the images folder
function importAll(r) {
  return r.keys().map(r);
}

// Import all images from components/images folder
const backgrounds = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [naturalEvents, setNaturalEvents] = useState([]);
  const [naturalIndex, setNaturalIndex] = useState(0);
  const [insightWeather, setInsightWeather] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [insightError, setInsightError] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const res = await fetch(`https://api.nasa.gov/DONKI/notifications?api_key=DEMO_KEY`);
        const data = await res.json();
        setEvents(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching DONKI data:', error);
      }
    };

    const fetchEONET = async () => {
      try {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&status=open');
        const data = await res.json();
        if (data && data.events) {
          setNaturalEvents(data.events);
        }
      } catch (error) {
        console.error('Error fetching EONET events:', error);
      }
    };

    const fetchInsightWeather = async () => {
      try {
        setLoadingInsight(true);
        setInsightError(null);
        const res = await fetch(
          'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0'
        );
        if (!res.ok) {
          throw new Error('Failed to fetch Insight Mars Weather data');
        }
        const data = await res.json();
        const solKeys = data['sol_keys'];
        if (solKeys && solKeys.length > 0) {
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

    fetchSpaceWeather();
    fetchEONET();
    fetchInsightWeather();
  }, []);

  // Background image changer with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 30000); // change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setNaturalIndex((prevIndex) => (prevIndex + 1) % naturalEvents.length);
  };

  const handlePrev = () => {
    setNaturalIndex((prevIndex) => (prevIndex - 1 + naturalEvents.length) % naturalEvents.length);
  };

  return (
    <div
      className="home-container fade-bg"
      style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
      key={bgIndex} // forces re-render to trigger CSS animation if you have it
    >
      <h1 className="home-title">Welcome to NASA Space Explorer</h1>
      <p className="home-subtitle">
        Discover the wonders of the universe through real NASA data and imagery.
        NASA Space Explorer offers astronomy visuals, Mars Rover captures, Earth imagery,
        and insights into near-Earth phenomena.
      </p>

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
            disabled={events.length === 0}
          >
            View Details
          </button>
        </div>
      </div>

      {naturalEvents.length > 0 && (
        <div className="eonet-event">
          <h3>Latest Natural Events (EONET)</h3>
          <p>{naturalEvents[naturalIndex].title}</p>
          <p className="info">Category: {naturalEvents[naturalIndex].categories?.[0]?.title || 'N/A'}</p>
          <p className="info">Started: {naturalEvents[naturalIndex].geometry?.[0]?.date?.split('T')[0]}</p>

          <div className="view-btn-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button className="view-details-btn" onClick={handlePrev}>&larr;</button>
            <button className="view-details-btn" onClick={() => setSelectedEvent(naturalEvents[naturalIndex])}>
              View Details
            </button>
            <button className="view-details-btn" onClick={handleNext}>&rarr;</button>
          </div>
        </div>
      )}

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

      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setSelectedEvent(null)} className="modal-close-btn" title="Close">
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
                  Coordinates:{' '}
                  {selectedEvent.geometry?.[0]?.coordinates
                    ? selectedEvent.geometry[0].coordinates.join(', ')
                    : 'N/A'}
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
