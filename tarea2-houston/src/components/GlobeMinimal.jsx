import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import createGlobe from 'globe.gl';

const antennas = [
  { name: 'Madrid DSN', lat: 40.4314, lng: -4.2481 }
];

function GlobeMinimal() {
  const containerRef = useRef();
  const globeRef = useRef();

  useEffect(() => {
    if (globeRef.current) return;

    const globe = createGlobe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundColor('#000')
      .pointOfView({ lat: 0, lng: 0, altitude: 2 });

    globeRef.current = globe;

    // ⚠️ Muy importante: permitir clics en el canvas
    globe.renderer().domElement.style.pointerEvents = 'auto';

    // Antena
    globe
      .customLayerData(antennas)
      .customThreeObject((d) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.2),
          new THREE.MeshBasicMaterial({ color: 'orange' })
        );
        mesh.userData = { type: 'antenna', data: d };
        mesh.cursor = 'pointer';
        return mesh;
      })
      .customThreeObjectUpdate((obj, d) => {
        const { x, y, z } = globe.getCoords(d.lat, d.lng, 0.01);
        obj.position.set(x, y, z);
      })
      .onObjectClick((obj) => {
        if (obj.userData?.type === 'antenna') {
          console.log("✅ Clic detectado en antena:", obj.userData.data);
          alert(`Antena clickeada: ${obj.userData.data.name}`);
        }
      });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'auto'
      }}
    />
  );
}

export default GlobeMinimal;