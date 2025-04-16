import { useState, useCallback } from 'react';
import useWebSocket from './hooks/useWebSocket';
import Globe from './components/Globe';
import AntennaInfo from './components/AntennaInfo';
import SatelliteTable from './components/SatelliteTable';

function App() {
  const [satellites, setSatellites] = useState([]);
  const [showCoverage, setShowCoverage] = useState(true);
  const [selectedAntenna, setSelectedAntenna] = useState(null);
  const [coveredSatellites, setCoveredSatellites] = useState([]);

  const handleMessage = useCallback((data) => {
    if (data.type === 'POSITION_UPDATE') {
      console.log("📡 Recibido:", data);
      setSatellites(data.satellites);
    }
    if (data.type === 'AUTH') {
      console.log('✅ Autenticado:', data.message);
    }
    if (data.type === 'SATELLITE-STATUS') {
      console.log('📶 Potencia recibida:', data);
      setSatellites(prev =>
        prev.map(sat =>
          sat.satellite_id === data.satellite_id
            ? { ...sat, power: data.power }
            : sat
        )
      );
    }
  }, []);

  const { sendMessage, isReady } = useWebSocket(handleMessage);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* botones y componentes */}
      <button
        disabled={!isReady}
        onClick={() => sendMessage({ type: 'SATELLITES' })}
        style={{ position: 'absolute', zIndex: 2, top: 10, left: 10 }}
      >
        Cargar satélites
      </button>

      <button
        onClick={() => setShowCoverage(prev => !prev)}
        style={{
          position: 'absolute',
          zIndex: 2,
          top: 60,
          left: 10,
          backgroundColor: showCoverage ? '#e74c3c' : '#2ecc71',
          color: 'white',
          padding: '0.5rem 1rem',
        }}
      >
        {showCoverage ? 'Ocultar' : 'Mostrar'} cobertura
      </button>

      <Globe
        satellites={satellites}
        showCoverage={showCoverage}
        setSelectedAntenna={setSelectedAntenna}
        setCoveredSatellites={setCoveredSatellites}
        coveredSatellites={coveredSatellites}
        sendMessage={sendMessage}
      />

      <AntennaInfo antenna={selectedAntenna} satellites={coveredSatellites} />

      <SatelliteTable satellites={coveredSatellites} />
    </div>
  );
}

export default App;