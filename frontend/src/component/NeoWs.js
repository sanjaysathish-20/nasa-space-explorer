import React, { useState } from 'react';
import axios from 'axios';

function NeoWs() {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2010-06-01'));
  const [endDate, setEndDate] = useState(new Date('2025-06-27'));

  const fetchNeoData = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&api_key=DEMO_KEY`;

    try {
      const res = await axios.get(url);
      const raw = res.data.near_earth_objects;
      const flatList = Object.values(raw).flat();
      setNeos(flatList);
    } catch (error) {
      console.error('Error fetching NEO data:', error);
      alert('Failed to fetch NEO data');
      setNeos([]);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Near Earth Objects</h2>

      <label>
        Start Date:{" "}
        <input
          type="date"
          value={startDate.toISOString().split('T')[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
      </label>

      <label style={{ marginLeft: '1rem' }}>
        End Date:{" "}
        <input
          type="date"
          value={endDate.toISOString().split('T')[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={fetchNeoData}>Fetch NEOs</button>
      </div>

      {loading && <p>Loading NEOs...</p>}

      {!loading && neos.length === 0 && (
        <p>Please select a date range and click "Fetch NEOs".</p>
      )}

      {!loading && neos.length > 0 && (
        <ul>
          {neos.map((neo) => (
            <li key={neo.id}>
              <strong>{neo.name}</strong> – Estimated Diameter:{" "}
              {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}m –{" "}
              Hazardous: {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NeoWs;
