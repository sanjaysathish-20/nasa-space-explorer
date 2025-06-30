import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Apod from './components/Apod';
import MarsPhotos from './components/MarsPhotos';
import Epic from './components/Epic';
import NeoWs from './components/NeoWs';
import ImageLibrary from './components/ImageLibrary';
import Home from './components/Home';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apod" element={<Apod />} />
          <Route path="/mars" element={<MarsPhotos />} />
          <Route path="/epic" element={<Epic />} />
          <Route path="/neo" element={<NeoWs />} />
          <Route path="/library" element={<ImageLibrary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;