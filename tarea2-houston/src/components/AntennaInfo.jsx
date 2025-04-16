function AntennaInfo({ antenna, satellites }) {
    if (!antenna) return null;
  
    return (
      <div style={{
        position: 'absolute',
        top: 120,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        zIndex: 10,
        maxWidth: '300px'
      }}>
        <h3>📡 {antenna.name}</h3>
        <p><strong>Satélites cubiertos:</strong></p>
        <ul style={{ paddingLeft: '1rem' }}>
          {satellites.length > 0 ? satellites.map((sat, idx) => (
            <li key={idx}>
              🛰️ {sat.satellite_id}<br />
              Señal: {sat.signal}%<br />
              Distancia: {sat.distance} km
            </li>
          )) : <li>No hay satélites en cobertura.</li>}
        </ul>
      </div>
    );
  }
  
  export default AntennaInfo;