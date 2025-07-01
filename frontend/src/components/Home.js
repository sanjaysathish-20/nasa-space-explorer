import React, { useEffect, useState } from 'react';
import './Home.css';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg|gif)$/));

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [naturalEvents, setNaturalEvents] = useState([]);
  const [currentNaturalIndex, setCurrentNaturalIndex] = useState(0);
  const [marsWeather, setMarsWeather] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const res = await fetch(`https://api.nasa.gov/DONKI/notifications?api_key=DEMO_KEY`);
        const data = await res.json();
        setEvents(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching DONKI data:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    const fetchEONET = async () => {
      try {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&status=open');
        const data = await res.json();
        if (data && data.events) setNaturalEvents(data.events);
      } catch (error) {
        console.error('Error fetching EONET events:', error);
      }
    };

    const fetchMarsWeather = async () => {
      try {
        const res = await fetch(
          'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0'
        );
        const data = await res.json();
        const sols = data.sol_keys;
        if (sols?.length > 0) {
          const latestSol = sols[sols.length - 1];
          setMarsWeather({ sol: latestSol, weather: data[latestSol] });
        }
      } catch (error) {
        console.error('Error fetching Mars weather:', error);
        setMarsWeather(null);
      }
    };

    fetchSpaceWeather();
    fetchEONET();
    fetchMarsWeather();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Open modal with first alert event on "View" button click
  const handleViewAlerts = () => {
    if (events.length > 0) setSelectedEvent(events[0]);
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white',
        padding: '30px 20px',
      }}
    >
      <h1 className="home-title">Welcome to NASA Space Explorer</h1>
      <p className="home-subtitle">
        Explore real-time NASA data including space weather alerts, recent Earth natural events, and Mars weather. Discover the universe with live updates and stunning NASA imagery all in one place!.
      </p>

      {/* Vertical stacking of cards */}
      <div className="vertical-cards">

        {/* Space Weather Alerts */}
        <section className="card-section">
          <h2>Space Weather Alerts</h2>
          {loadingEvents ? (
            <p>Loading alerts...</p>
          ) : events.length === 0 ? (
            <p>No alerts available.</p>
          ) : (
            <>
              <div className="space-alerts-ticker" aria-label="Space Weather Alerts">
                <div className="ticker-move">
                  {/* Repeat twice for seamless looping */}
                  {[...events.slice(0, 10), ...events.slice(0, 10)].map((event, idx) => (
                    <div key={idx} className="space-alert-item">
                      <strong>{event.messageType}</strong>: {event.messageBody?.slice(0, 80)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                  ))}
                </div>
              </div>
              <button className="view-btn" onClick={handleViewAlerts}>
                View
              </button>
            </>
          )}
        </section>

        {/* EONET Event */}
        {naturalEvents.length > 0 && (
          <section className="card-section">
            <h2>Recent Earth Observations</h2>
            <div className="eonet-details">
              <h3>{naturalEvents[currentNaturalIndex].title}</h3>
              <p>Category: {naturalEvents[currentNaturalIndex].categories?.[0]?.title || 'N/A'}</p>
              <p>
                Started:{' '}
                {naturalEvents[currentNaturalIndex].geometry?.[0]?.date
                  ?.split('T')[0]}
              </p>
              <button
                onClick={() => setSelectedEvent(naturalEvents[currentNaturalIndex])}
                className="view-details-btn"
              >
                View Details
              </button>
            </div>
          </section>
        )}

        {/* Mars Weather */}
        <section className="card-section">
          <h2>Insight Mars Weather</h2>
          {marsWeather ? (
            <>
              <p>
                <strong>Sol:</strong> {marsWeather.sol}
              </p>
              <p>
                <strong>Season:</strong> {marsWeather.weather.Season || 'N/A'}
              </p>
              <p>
                <strong>Temperature:</strong> Min: {marsWeather.weather.AT?.mn ?? 'N/A'}°C, Max:{' '}
                {marsWeather.weather.AT?.mx ?? 'N/A'}°C
              </p>
              <p>
                <strong>Wind Speed:</strong> Min: {marsWeather.weather.HWS?.mn ?? 'N/A'} m/s, Max:{' '}
                {marsWeather.weather.HWS?.mx ?? 'N/A'} m/s
              </p>
              <p>
                <strong>Pressure:</strong> {marsWeather.weather.PRE?.av ?? 'N/A'} Pa
              </p>
              <a
                href="https://mars.nasa.gov/insight/weather/"
                target="_blank"
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                Learn More
              </a>
            </>
          ) : (
            <p>Failed to load Mars weather data.</p>
          )}
        </section>
      </div>

      {/* Modal for Detailed View */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedEvent(null)} className="modal-close-btn">
              ✕
            </button>

            {/* Check if selectedEvent is from naturalEvents by ID */}
            {naturalEvents.find(event => event.id === selectedEvent.id) ? (
              <>
                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.description || 'No description available.'}</p>
                <p>
                  <strong>Category:</strong> {selectedEvent.categories?.[0]?.title}
                </p>
                <p>
                  <strong>Date:</strong> {selectedEvent.geometry?.[0]?.date?.split('T')[0]}
                </p>
                <a
                  href={selectedEvent.sources?.[0]?.url || selectedEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>

                {/* Arrow navigation */}
                <div className="event-nav-buttons" style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => {
                      const currentIdx = naturalEvents.findIndex(e => e.id === selectedEvent.id);
                      const prevIdx = currentIdx === 0 ? naturalEvents.length - 1 : currentIdx - 1;
                      setSelectedEvent(naturalEvents[prevIdx]);
                      setCurrentNaturalIndex(prevIdx);
                    }}
                  >
                    &larr; Prev
                  </button>
                  <button
                    onClick={() => {
                      const currentIdx = naturalEvents.findIndex(e => e.id === selectedEvent.id);
                      const nextIdx = currentIdx === naturalEvents.length - 1 ? 0 : currentIdx + 1;
                      setSelectedEvent(naturalEvents[nextIdx]);
                      setCurrentNaturalIndex(nextIdx);
                    }}
                  >
                    Next &rarr;
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* For DONKI alerts */}
                <h2>{selectedEvent.messageType}</h2>
                <p>{selectedEvent.messageBody}</p>
                <p>
                  <strong>Issued:</strong> {new Date(selectedEvent.messageIssueTime).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
