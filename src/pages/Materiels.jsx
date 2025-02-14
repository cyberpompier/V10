import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaInfoCircle } from 'react-icons/fa';
import './Materiels.css';

function Materiels() {
  const [equipment, setEquipment] = useState([]);
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [vehicles, setVehicles] = useState(['all']);
  const [locations, setLocations] = useState(['all']);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'materials'));
        const allItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Extract unique vehicles and locations
        const uniqueVehicles = ['all', ...new Set(allItems.map(item => item.affection))];
        const uniqueLocations = ['all', ...new Set(allItems.map(item => item.emplacement))];
        setVehicles(uniqueVehicles);
        setLocations(uniqueLocations);

        // Apply filters
        let filteredItems = [...allItems];
        if (vehicleFilter !== 'all') {
          filteredItems = filteredItems.filter(item => item.affection === vehicleFilter);
        }
        if (locationFilter !== 'all') {
          filteredItems = filteredItems.filter(item => item.emplacement === locationFilter);
        }

        setEquipment(filteredItems);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    fetchEquipment();
  }, [vehicleFilter, locationFilter]);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBeaconClick = (item) => {
    // Your existing handleBeaconClick logic
  };

  const closeCommentPopup = () => {
    // Your existing closeCommentPopup logic
  };

  return (
    <main className="main-content">
      <div className="filters">
        <label htmlFor="vehicleFilter">Véhicule:</label>
        <select
          id="vehicleFilter"
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
        >
          {vehicles.map(vehicle => (
            <option key={vehicle} value={vehicle}>{vehicle}</option>
          ))}
        </select>

        <label htmlFor="locationFilter">Emplacement:</label>
        <select
          id="locationFilter"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      <div className="equipment-list">
        {equipment.map((item) => (
          <div key={item.id} className="equipment-item">
            <img
              src={item.photo}
              alt={item.denomination}
              className="equipment-image"
              onClick={handleImageClick}
              style={{ cursor: 'pointer' }}
            />
            <div className="equipment-details">
              <div className="equipment-name">
                {item.denomination}
              </div>
              <p>Quantité: {item.quantity}</p>
              <a href="#">Documentation</a>
              <p>Affectation: {item.affection}</p>
              <p>Emplacement: {item.emplacement}</p>
            </div>
            {item.comment && (
              <div className="beacon" onClick={handleBeaconClick}>
                <span className="beacon-icon">🚨</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Materiels;
