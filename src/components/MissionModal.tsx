import React from 'react';
import { calculateDistance } from '../utils/mapUtils';

interface MissionModalProps {
  coordinates: number[][];
  onInsertPolygon: (index: number, position: 'before' | 'after') => void;
  onClose: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({ coordinates, onInsertPolygon, onClose }) => {
  return (
    <div className="modal mission-modal">
      <h2>Mission Planner</h2>
      <table>
        <thead>
          <tr>
            <th>WP</th>
            <th>Coordinates</th>
            <th>Distance (m)</th>
            <th>Actions</th>
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
              <td>
                <div className="dropdown">
                  <button className="dropbtn">•••</button>
                  <div className="dropdown-content">
                    <button onClick={() => onInsertPolygon(index, 'before')}>
                      Insert Polygon Before
                    </button>
                    <button onClick={() => onInsertPolygon(index, 'after')}>
                      Insert Polygon After
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose} className="close-button">Close</button>
    </div>
  );
};

export default MissionModal;

