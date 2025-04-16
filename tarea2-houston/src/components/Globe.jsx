import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import createGlobe from 'globe.gl';

const RADIUS_EARTH_KM = 6371;

const antennas = [
  { name: 'Goldstone DSN', lat: 35.4267, lng: -116.8900 },
  { name: 'Madrid DSN', lat: 40.4314, lng: -4.2481 },
  { name: 'Canberra DSN', lat: -35.4014, lng: 148.9817 }
];

function Globe({ satellites, showCoverage }) {
  const containerRef = useRef();
  const globeRef = useRef();
  const coverageMeshes = useRef([]);

  useEffect(() => {
    const globe = createGlobe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundColor('#000')
      .pointOfView({ lat: 0, lng: 0, altitude: 2 });

    globeRef.current = globe;

    globe
      .customLayerData(antennas)
      .customThreeObject((antenna) => {
        const obj = new THREE.Mesh(
          new THREE.SphereGeometry(0.2),
          new THREE.MeshBasicMaterial({ color: 'orange' })
        );
        obj.userData = { type: 'antenna', data: antenna };
        obj.cursor = 'pointer';
        return obj;
      })
      .customThreeObjectUpdate((obj, d) => {
        obj.__data = d;
        const { x, y, z } = globe.getCoords(d.lat, d.lng, 0.01);
        obj.position.set(x, y, z);
      });
  }, []);

  useEffect(() => {
    if (!globeRef.current || !satellites.length) return;

    globeRef.current
      .pointsData(satellites.map(s => ({
        lat: s.position.lat,
        lng: s.position.long,
        size: 0.2,
        color: getSatelliteColor(s.type),
        ...s
      })))
      .pointAltitude('size')
      .pointColor('color');
  }, [satellites]);

  useEffect(() => {
    if (!globeRef.current || !satellites.length) return;

    coverageMeshes.current.forEach(mesh => globeRef.current.scene().remove(mesh));
    coverageMeshes.current = [];

    if (!showCoverage) return;

    satellites.forEach(sat => {
      const power = sat.power ?? 500; // fallback
      if (!sat.position || typeof sat.position.lat !== 'number' || typeof sat.position.long !== 'number') return;

      const circle = createCoverageCircle(sat.position.lat, sat.position.long, power);
      globeRef.current.scene().add(circle);
      coverageMeshes.current.push(circle);
    });
  }, [satellites, showCoverage]);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}

function getSatelliteColor(type) {
  switch (type) {
    case 'COM': return 'lightblue';
    case 'NAV': return 'green';
    case 'SCI': return 'purple';
    case 'SPY': return 'red';
    default: return 'white';
  }
}

function createCoverageCircle(lat, lng, radiusKm) {
  const segments = 64;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);

    const dLat = (dy / RADIUS_EARTH_KM) * (180 / Math.PI);
    const dLng = (dx / (RADIUS_EARTH_KM * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);

    const circleLat = lat + dLat;
    const circleLng = lng + dLng;

    const phi = (90 - circleLat) * Math.PI / 180;
    const theta = (circleLng + 180) * Math.PI / 180;

    const vec = new THREE.Vector3().setFromSphericalCoords(1.01, phi, theta);
    points.push(vec);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });

  return new THREE.LineLoop(geometry, material);
}

export default Globe;
