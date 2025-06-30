import React, { useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#58a6ff", "#f85149"]; // Blue = Non-hazardous, Red = Hazardous

function NeoWs() {
  const today = new Date();
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(today.getDate() - 6); // last 7 days

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNeoData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 7) {
      alert("Please select a date range of 7 days or less.");
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
      alert("Error fetching NEO data. Please check the date range.");
      setNeos([]);
    }

    setLoading(false);
  };

  const hazardousCount = neos.filter(
    (n) => n.is_potentially_hazardous_asteroid
  ).length;
  const nonHazardousCount = neos.length - hazardousCount;
  const pieData = [
    { name: "Non-Hazardous", value: nonHazardousCount },
    { name: "Hazardous", value: hazardousCount },
  ];

  return (
    <div style={{ padding: "1rem", backgroundColor: "#121212", minHeight: "100vh" }}>
      <h2 style={{ color: "#eee" }}>Near Earth Objects (NeoWs)</h2>

      <p style={{ color: "#bbb", marginBottom: "0.5rem" }}>
        Select a date range (up to 7 days) to fetch data about Near Earth Objects detected by NASA.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div>
          <label style={{ color: "#ccc" }}>
            Start Date:{" "}
            <input
              type="date"
              className="styled-date-picker"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              max={new Date().toISOString().split("T")[0]}
              style={{
                backgroundColor: "#333",
                color: "#eee",
                border: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
              }}
            />
          </label>
        </div>

        <div>
          <label style={{ color: "#ccc" }}>
            End Date:{" "}
            <input
              type="date"
              className="styled-date-picker"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              max={new Date().toISOString().split("T")[0]}
              style={{
                backgroundColor: "#333",
                color: "#eee",
                border: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
              }}
            />
          </label>
        </div>

        <button
          onClick={fetchNeoData}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1f6feb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            alignSelf: "center",
            height: "40px",
            marginLeft: "auto"
          }}
        >
          Fetch NEOs
        </button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          color: "#ccc",
        }}
      >
        <p style={{ marginBottom: "1rem", fontStyle: "italic", color: "#999" }}>
          Below is the list of Near Earth Objects detected in the selected date range. The pie chart summarizes how many are potentially hazardous.
        </p>

        {loading && <div>Loading...</div>}

        {!loading && neos.length === 0 && (
          <p>Please select a date range and click "Fetch NEOs".</p>
        )}

        {!loading && neos.length > 0 && (
          <>
            <div style={{ marginBottom: "2rem", maxHeight: "300px", overflowY: "auto" }}>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {neos.map((neo) => (
                  <li key={neo.id} style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: "#fff" }}>{neo.name}</strong> – Diameter:{" "}
                    {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1)} m – Hazardous:{" "}
                    {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ textAlign: "center" }}>
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
    </div>
  );
}

export default NeoWs;
