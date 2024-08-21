import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isSharing, setIsSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [busNumber, setBusNumber] = useState('');
  const [error, setError] = useState('');
  const [locationData, setLocationData] = useState({ latitude: null, longitude: null, speed: null, heading: null });
  const BACKENDURL = import.meta.env.VITE_BACKENDURL;

  useEffect(() => {
    let intervalId;

    const sendLocation = (latitude, longitude, speed, heading) => {
      axios.post(`${BACKENDURL}/api/location`, {
        busNumber,
        latitude,
        longitude,
        speed,
        heading,
        timestamp: new Date().toISOString(),
      })
        .then((response) => {
          const currentTime = new Date().toLocaleTimeString();
          const newMessage = `Location shared at ${currentTime} - Latitude: ${latitude}, Longitude: ${longitude}, Speed: ${speed} m/s, Heading: ${heading}°`;

          setMessages((prevMessages) => [newMessage, ...prevMessages]);

          intervalId = setTimeout(() => {
            if (isSharing) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  sendLocation(position.coords.latitude, position.coords.longitude, position.coords.speed, position.coords.heading);
                },
                (error) => {
                  console.error('Error fetching location:', error);
                  setError(`Error fetching location: ${error.message}`);
                },
                { enableHighAccuracy: true, maximumAge: 1000 }
              );
            }
          }, 5000);
        })
        .catch((error) => {
          console.error('Error sharing location:', error);
          setError(`Error sharing location: ${error.message}`);
        });
    };

    if (isSharing && busNumber) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, speed, heading } = position.coords;
          setLocationData({ latitude, longitude, speed, heading });
          sendLocation(latitude, longitude, speed, heading);
        },
        (error) => {
          console.error('Error fetching location:', error);
          setError(`Error fetching location: ${error.message}`);
        },
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    }

    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
    };
  }, [isSharing, busNumber]);

  const handleStart = () => {
    if (!busNumber) {
      setError('Bus number is required');
    } else {
      setError('');
      setIsSharing(true);
    }
  };

  const handleStop = () => {
    setIsSharing(false);
  };

  return (
    <div className="container">
      <input
        className="busnumberfeild"
        type="text"
        placeholder="Enter Bus Number (e.g., MH08AA1234)"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
        disabled={isSharing}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleStart} disabled={isSharing || !busNumber}>
        Start Sharing Location
      </button>
      <button onClick={handleStop} disabled={!isSharing}>
        Stop Sharing Location
      </button>
      <p>Current Location: Latitude {locationData.latitude}, Longitude {locationData.longitude}</p>
      <p>Speed: {locationData.speed} m/s, Heading: {locationData.heading}°</p>

      <div className="location-updates">
        <h4>Location Updates</h4>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
