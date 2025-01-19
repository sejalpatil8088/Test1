import React, { useState } from 'react';
import Map from './components/Map';
import DrawButton from './components/DrawButton';
import MissionModal from './components/MissionModal';
import PolygonModal from './components/PolygonModal';
import './styles/App.css';

const App: React.FC = () => {
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showPolygonModal, setShowPolygonModal] = useState(false);
  const [lineStringCoordinates, setLineStringCoordinates] = useState<number[][]>([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][]>([]);
  const [drawingMode, setDrawingMode] = useState<'LineString' | 'Polygon' | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const handleDrawClick = () => {
    setShowMissionModal(true);
    setDrawingMode('LineString');
  };

  const handleLineStringComplete = (coordinates: number[][]) => {
    setLineStringCoordinates(coordinates);
    setDrawingMode(null);
  };

  const handlePolygonComplete = (coordinates: number[][]) => {
    setPolygonCoordinates(coordinates);
    setDrawingMode(null);
    setShowPolygonModal(true);
  };

  const handleInsertPolygon = (index: number, position: 'before' | 'after') => {
    setShowMissionModal(false);
    setDrawingMode('Polygon');
    setInsertIndex(position === 'before' ? index : index + 1);
  };

  const handleImportPoints = () => {
    setShowPolygonModal(false);
    setShowMissionModal(true);
    if (insertIndex !== null) {
      const newLineString = [
        ...lineStringCoordinates.slice(0, insertIndex),
        ...polygonCoordinates,
        ...lineStringCoordinates.slice(insertIndex)
      ];
      setLineStringCoordinates(newLineString);
      setInsertIndex(null);
    }
  };

  return (
    <div className="app">
      <Map
        drawingMode={drawingMode}
        onLineStringComplete={handleLineStringComplete}
        onPolygonComplete={handlePolygonComplete}
        lineStringCoordinates={lineStringCoordinates}
        polygonCoordinates={polygonCoordinates}
      />
      <DrawButton onClick={handleDrawClick} />
      {showMissionModal && (
        <MissionModal
          coordinates={lineStringCoordinates}
          onInsertPolygon={handleInsertPolygon}
          onClose={() => setShowMissionModal(false)}
        />
      )}
      {showPolygonModal && (
        <PolygonModal
          coordinates={polygonCoordinates}
          onImportPoints={handleImportPoints}
          onClose={() => setShowPolygonModal(false)}
        />
      )}
    </div>
  );
};

export default App;


