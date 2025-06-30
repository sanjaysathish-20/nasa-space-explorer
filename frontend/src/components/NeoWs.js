import React, { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#58a6ff", "#f85149"]; // Blue for non-hazardous, red for hazardous

function NeoWs() {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2025-06-21"));
  const [endDate, setEndDate] = useState(new Date("2025-06-27"));

  const fetchNeoData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    setLoading(true);

    const formatDate = (date) => date.toISOString().split("T")[0];
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatDate(
      startDate
    )}&end_date=${formatDate(endDate)}&api_key=DEMO_KEY`;

    try {
      const res = await axios.get(url);
      const raw = res.data.near_earth_objects;
      const flatList = Object.values(raw).flat();
      setNeos(flatList);
    } catch (error) {
      console.error("Error fetching NEO data:", error);
      alert("Select a different date range of 7 days or less.");
      setNeos([]);
    }

    setLoading(false);
  };

  // Prepare data for pie chart: count hazardous vs non-hazardous
  const hazardousCount = neos.filter((n) => n.is_potentially_hazardous_asteroid).length;
  const nonHazardousCount = neos.length - hazardousCount;
  const pieData = [
    { name: "Non-Hazardous", value: nonHazardousCount },
    { name: "Hazardous", value: hazardousCount },
  ];

  return (
    <div className="App">
      <h2>Near Earth Objects</h2>

      <div className="date-picker-container">
        <label>
          Start Date:{" "}
          <input
            type="date"
            className="styled-date-picker"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            max={new Date().toISOString().split("T")[0]}
          />
        </label>
      </div>

      <div className="date-picker-container" style={{ marginBottom: "1rem" }}>
        <label>
          End Date:{" "}
          <input
            type="date"
            className="styled-date-picker"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            max={new Date().toISOString().split("T")[0]}
          />
        </label>
      </div>

      <button onClick={fetchNeoData} style={{ cursor: "pointer" }}>
        Fetch NEOs
      </button>

      {loading && <div className="loading-spinner"></div>}

      {!loading && neos.length === 0 && (
        <p>Please select a date range and click "Fetch NEOs".</p>
      )}

      {!loading && neos.length > 0 && (
        <>
          <div className="data-section">
            <ul>
              {neos.map((neo) => (
                <li key={neo.id}>
                  <strong>{neo.name}</strong> – Estimated Diameter:{" "}
                  {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}m – Hazardous:{" "}
                  {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                </li>
              ))}
            </ul>
          </div>

          <div className="data-section" style={{ marginTop: "2rem", textAlign: "center" }}>
            <h3>Hazardous vs Non-Hazardous NEOs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default NeoWs;
