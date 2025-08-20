import React, { useState, useEffect } from 'react';
import './App.css';

// Define the shape of backend response
interface BackendData {
  data: {
    test: string;
    'test-two': string;
  };
}

const App = () => {
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Backend URL - configurable via environment variables
  const BACKEND_URL: string = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async (): Promise<void> => {
      try {
        const response: Response = await fetch(`${BACKEND_URL}/api/data`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: BackendData = await response.json();
        setBackendData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to backend';
        setError(errorMessage);
        console.error('Backend connection error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kubernetes Full-Stack App</h1>
        
        {loading && <p>Loading backend data...</p>}
        
        {error && (
          <div style={{ color: 'red' }}>
            <p>Error: {error}</p>
            <p>Make sure your backend is running on port 3001</p>
          </div>
        )}
        
        {backendData && (
          <div>
            <h2>✅ Backend Connection Successful!</h2>
            <div style={{ textAlign: 'left', margin: '20px' }}>
              <h3>Backend Response:</h3>
              <pre style={{ 
                background: '#f0f0f0', 
                padding: '10px', 
                borderRadius: '5px', 
                color: 'black' 
              }}>
                {JSON.stringify(backendData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;