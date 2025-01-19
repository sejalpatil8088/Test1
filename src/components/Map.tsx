import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw, Modify } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { LineString, Polygon } from 'ol/geom';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

interface MapProps {
  drawingMode: 'LineString' | 'Polygon' | null;
  onLineStringComplete: (coordinates: number[][]) => void;
  onPolygonComplete: (coordinates: number[][]) => void;
  lineStringCoordinates: number[][];
  polygonCoordinates: number[][];
}

const MapComponent: React.FC<MapProps> = ({
  drawingMode,
  onLineStringComplete,
  onPolygonComplete,
  lineStringCoordinates,
  polygonCoordinates
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      vectorSourceRef.current = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSourceRef.current,
        style: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2
          })
        })
      });

      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });

      const modify = new Modify({ source: vectorSourceRef.current });
      mapInstanceRef.current.addInteraction(modify);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && vectorSourceRef.current) {
      if (drawInteractionRef.current) {
        mapInstanceRef.current.removeInteraction(drawInteractionRef.current);
      }

      if (drawingMode) {
        drawInteractionRef.current = new Draw({
          source: vectorSourceRef.current,
          type: drawingMode,
        });

        drawInteractionRef.current.on('drawend', (event) => {
          const feature = event.feature;
          const geometry = feature.getGeometry();
          if (geometry) {
            const coordinates = geometry.getCoordinates();
            const lonLatCoords = coordinates.map((coord: number[]) => toLonLat(coord));
            if (drawingMode === 'LineString') {
              onLineStringComplete(lonLatCoords);
            } else if (drawingMode === 'Polygon') {
              onPolygonComplete(lonLatCoords[0]);
            }
          }
        });

        mapInstanceRef.current.addInteraction(drawInteractionRef.current);
      }
    }
  }, [drawingMode, onLineStringComplete, onPolygonComplete]);

  useEffect(() => {
    if (vectorSourceRef.current) {
      vectorSourceRef.current.clear();
      if (lineStringCoordinates.length > 0) {
        const lineString = new LineString(lineStringCoordinates.map(coord => fromLonLat(coord)));
        vectorSourceRef.current.addFeature(new Feature(lineString));
      }
      if (polygonCoordinates.length > 0) {
        const polygon = new Polygon([polygonCoordinates.map(coord => fromLonLat(coord))]);
        vectorSourceRef.current.addFeature(new Feature(polygon));
      }
    }
  }, [lineStringCoordinates, polygonCoordinates]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;

