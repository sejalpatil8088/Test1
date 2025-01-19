import React from 'react';
import { calculateDistance } from '../utils/mapUtils';

interface PolygonModalProps {
  coordinates: number[][];
  onImportPoints: () => void;
  onClose: () => void;
}

const PolygonModal: React.FC<PolygonModalProps> = ({ coordinates, onImportPoints, onClose }) => {
  return (
    <div className="modal polygon-modal">
      <h2>Polygon Coordinates</h2>
      <table>
        <thead>
          <tr>
            <th>WP</th>
            <th>Coordinates</th>
            <th>Distance (m)</th>
          </tr>
        </thead>
        <tbody>
          {coordinates.map((coord, index) => (
            <tr key={index}>
              <td>WP({index.toString().padStart(2, '0')})</td>
              <td>{`${coord[0].toFixed(8)}, ${coord[1].toFixed(8)}`}</td>
              <td>
                {index > 0
                  ? calculateDistance(coordinates[index - 1], coord).toFixed(2)
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button onClick={onImportPoints} className="import-button">Import Points</button>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default PolygonModal;

