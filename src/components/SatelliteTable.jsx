function SatelliteTable({ satellites }) {
    if (!satellites) return null;
  
    return (
      <div style={{
        position: 'absolute',
        top: 120,
        right: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3>🛰️ Satélites cubiertos</h3>
        <table style={{ width: '100%', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Señal</th>
              <th style={{ textAlign: 'left' }}>Distancia (km)</th>
            </tr>
          </thead>
          <tbody>
            {satellites.length > 0 ? (
              satellites.map((sat, i) => (
                <tr key={i}>
                  <td>{sat.satellite_id}</td>
                  <td>{sat.signal}%</td>
                  <td>{sat.distance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  No hay datos aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default SatelliteTable;