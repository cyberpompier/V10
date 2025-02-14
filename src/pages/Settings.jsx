import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import './Settings.css';

function Settings() {
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  const [newVehicleDenomination, setNewVehicleDenomination] = useState('');
  const [newVehicleImmatriculation, setNewVehicleImmatriculation] = useState('');
  const [newVehicleCaserne, setNewVehicleCaserne] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('');
  const [newVehicleEmplacements, setNewVehicleEmplacements] = useState('');
  const [newVehiclePhoto, setNewVehiclePhoto] = useState('');
  const [newVehicleLien, setNewVehicleLien] = useState('');
  const [newVehicleDocumentation, setNewVehicleDocumentation] = useState('');

  const [newMaterialDenomination, setNewMaterialDenomination] = useState('');
  const [newMaterialQuantity, setNewMaterialQuantity] = useState('');
  const [newMaterialAffection, setNewMaterialAffection] = useState('');
  const [newMaterialEmplacement, setNewMaterialEmplacement] = useState('');
  const [newMaterialPhoto, setNewMaterialPhoto] = useState('');
  const [newMaterialDocumentation, setNewMaterialDocumentation] = useState('');

  const [vehicles, setVehicles] = useState([]);
  const [emplacements, setEmplacements] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vehicles'));
        const vehicleList = querySnapshot.docs.map(doc => ({
          denomination: doc.data().denomination,
          emplacements: doc.data().emplacements ? doc.data().emplacements.split(',').map(s => s.trim()) : []
        }));
        setVehicles(vehicleList);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (newMaterialAffection) {
      const selectedVehicle = vehicles.find(v => v.denomination === newMaterialAffection);
      if (selectedVehicle) {
        setEmplacements(selectedVehicle.emplacements);
      } else {
        setEmplacements([]);
      }
    } else {
      setEmplacements([]);
    }
  }, [newMaterialAffection, vehicles]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'vehicles'), {
        denomination: newVehicleDenomination,
        immatriculation: newVehicleImmatriculation,
        caserne: newVehicleCaserne,
        type: newVehicleType,
        emplacements: newVehicleEmplacements,
        photo: newVehiclePhoto,
        lien: newVehicleLien,
        documentation: newVehicleDocumentation
      });
      setNewVehicleDenomination('');
      setNewVehicleImmatriculation('');
      setNewVehicleCaserne('');
      setNewVehicleType('');
      setNewVehicleEmplacements('');
      setNewVehiclePhoto('');
      setNewVehicleLien('');
      setNewVehicleDocumentation('');
      setShowVehicleForm(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'materials'), {
        denomination: newMaterialDenomination,
        quantity: newMaterialQuantity,
        affection: newMaterialAffection,
        emplacement: newMaterialEmplacement,
        photo: newMaterialPhoto,
        documentation: newMaterialDocumentation
      });
      setNewMaterialDenomination('');
      setNewMaterialQuantity('');
      setNewMaterialAffection('');
      setNewMaterialEmplacement('');
      setNewMaterialPhoto('');
      setNewMaterialDocumentation('');
      setShowMaterialForm(false);
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  const openVehicleForm = () => {
    setShowVehicleForm(true);
  };

  const openMaterialForm = () => {
    setShowMaterialForm(true);
  };

  return (
    <main className="main-content">
      <button onClick={openVehicleForm} className="settings-button">Ajouter un véhicule</button>
      <button onClick={openMaterialForm} className="settings-button">Ajouter un matériel</button>

      {showVehicleForm && (
        <div className="modal">
          <div className="modal-content settings-modal">
            <span className="close" onClick={() => setShowVehicleForm(false)}>&times;</span>
            <h3>Ajouter un véhicule</h3>
            <form onSubmit={handleAddVehicle} className="settings-form">
              <input
                type="text"
                placeholder="Denomination"
                value={newVehicleDenomination}
                onChange={(e) => setNewVehicleDenomination(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Immatriculation"
                value={newVehicleImmatriculation}
                onChange={(e) => setNewVehicleImmatriculation(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Caserne"
                value={newVehicleCaserne}
                onChange={(e) => setNewVehicleCaserne(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Type"
                value={newVehicleType}
                onChange={(e) => setNewVehicleType(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Emplacements"
                value={newVehicleEmplacements}
                onChange={(e) => setNewVehicleEmplacements(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Photo URL"
                value={newVehiclePhoto}
                onChange={(e) => setNewVehiclePhoto(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Lien (optional)"
                value={newVehicleLien}
                onChange={(e) => setNewVehicleLien(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Documentation URL (optional)"
                value={newVehicleDocumentation}
                onChange={(e) => setNewVehicleDocumentation(e.target.value)}
                className="settings-input"
              />
              <div className="settings-buttons">
                <button type="submit" className="settings-submit-button">Ajouter</button>
                <button type="button" className="settings-cancel-button" onClick={() => setShowVehicleForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMaterialForm && (
        <div className="modal">
          <div className="modal-content settings-modal">
            <span className="close" onClick={() => setShowMaterialForm(false)}>&times;</span>
            <h3>Ajouter un matériel</h3>
            <form onSubmit={handleAddMaterial} className="settings-form">
              <input
                type="text"
                placeholder="Denomination"
                value={newMaterialDenomination}
                onChange={(e) => setNewMaterialDenomination(e.target.value)}
                className="settings-input"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newMaterialQuantity}
                onChange={(e) => setNewMaterialQuantity(e.target.value)}
                className="settings-input"
              />
              <select
                value={newMaterialAffection}
                onChange={(e) => setNewMaterialAffection(e.target.value)}
                className="settings-input"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.denomination} value={vehicle.denomination}>{vehicle.denomination}</option>
                ))}
              </select>
              <select
                value={newMaterialEmplacement}
                onChange={(e) => setNewMaterialEmplacement(e.target.value)}
                className="settings-input"
              >
                <option value="">Select Emplacement</option>
                {emplacements.map(emplacement => (
                  <option key={emplacement} value={emplacement}>{emplacement}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Photo URL"
                value={newMaterialPhoto}
                onChange={(e) => setNewMaterialPhoto(e.target.value)}
                className="settings-input"
              />
              <input
                type="text"
                placeholder="Documentation URL (optional)"
                value={newMaterialDocumentation}
                onChange={(e) => setNewMaterialDocumentation(e.target.value)}
                className="settings-input"
              />
              <div className="settings-buttons">
                <button type="submit" className="settings-submit-button">Ajouter</button>
                <button type="button" className="settings-cancel-button" onClick={() => setShowMaterialForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;
