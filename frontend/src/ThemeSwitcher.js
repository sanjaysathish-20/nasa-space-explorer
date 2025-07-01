import React, { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark-mode');  // <-- add 'dark-mode'
    } else {
      document.body.classList.remove('dark-mode'); // <-- remove 'dark-mode'
    }
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)}>
      Switch to {dark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
