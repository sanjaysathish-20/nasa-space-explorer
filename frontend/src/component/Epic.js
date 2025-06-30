import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StyledDatePicker from './StyledDatePicker'; // adjust path if needed

function Epic() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date('2023-06-01')); // default as Date object

  useEffect(() => {
    const fetchEpicImages = async () => {
      setLoading(true);
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const res = await axios.get(`https://api.nasa.gov/EPIC/api/natural/date/${formattedDate}?api_key=DEMO_KEY`);
        const baseURL = `https://epic.gsfc.nasa.gov/archive/natural/${formattedDate.replace(/-/g, '/')}/jpg/`;

        const formatted = res.data.map(img => ({
          id: img.identifier,
          caption: img.caption,
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

  return (
    <div>
      <h2>Earth Polychromatic Imaging Camera (EPIC)</h2>

      <StyledDatePicker
        selectedDate={date}
        onChange={(newDate) => setDate(newDate)}
        label="Select Date"
        minDate={new Date('2015-06-13')}
        maxDate={new Date('2024-06-01')}
      />

      {loading ? (
        <p>Loading EPIC images...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {images.map(img => (
            <div key={img.id}>
              <img src={img.imageUrl} alt={img.caption} width="300" />
              <p>{img.caption}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Epic;
