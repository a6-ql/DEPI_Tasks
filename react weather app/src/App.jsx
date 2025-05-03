import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '8fa396b1bc214b579e8192646252804';
  const API_URL = 'http://api.weatherapi.com/v1/current.json';
  
  const cities = [
    'Cairo,Egypt',
    'London,UK',
    'New York,US',
    'Tokyo,Japan',
    'Paris,France',
    'Dubai,UAE',
    'Moscow,Russia',
    'Berlin,Germany',
    'Rome,Italy'
  ];

  useEffect(() => {
    const fetchAllWeather = async () => {
      try {
        const promises = cities.map(city =>
          axios.get(API_URL, {
            params: {
              key: API_KEY,
              q: city,
              aqi: 'no'
            }
          })
        );

        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data);
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(err.response?.data?.error?.message || 'Error fetching weather data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllWeather();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Global Weather Dashboard</h1>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {weatherData.map((weather, index) => (
          <div key={index} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title text-center h4 mb-3">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <div className="text-center mb-3">
                  <img
                    src={weather.current.condition.icon}
                    alt={weather.current.condition.text}
                    className="weather-icon"
                  />
                  <h3 className="temperature">{Math.round(weather.current.temp_c)}°C</h3>
                  <p className="condition">{weather.current.condition.text}</p>
                </div>
                <div className="weather-details">
                  <div className="row">
                    <div className="col-6">
                      <p><i className="bi bi-droplet"></i> <strong>Humidity:</strong> {weather.current.humidity}%</p>
                      <p><i className="bi bi-wind"></i> <strong>Wind:</strong> {weather.current.wind_kph} km/h</p>
                    </div>
                    <div className="col-6">
                      <p><i className="bi bi-thermometer-half"></i> <strong>Feels Like:</strong> {Math.round(weather.current.feelslike_c)}°C</p>
                      <p><i className="bi bi-speedometer"></i> <strong>Pressure:</strong> {weather.current.pressure_mb} mb</p>
                    </div>
                  </div>
                  <p className="text-muted mt-2 mb-0 small">
                    Last Updated: {new Date(weather.current.last_updated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 