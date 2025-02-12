import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaInfoCircle } from 'react-icons/fa';
import './Materiels.css';

function Materiels() {
  const [equipment, setEquipment] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'materials'));
        const items = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            denomination: data.denomination || 'Nom inconnu',
            quantity: data.quantity || 0,
            affection: data.affection || 'Affectation inconnue',
            emplacement: data.emplacement || 'Emplacement inconnu',
            photo: data.photo || 'URL photo par défaut',
            documentation: data.documentation || null,
            comment: data.comment || null,
            timestamp: data.timestamp || null,
            grade: data.grade || null,
            name: data.name || null,
            userPhoto: data.userPhoto || null
          };
        });
        setEquipment(items);
      } catch (error) {
        console.error("Erreur lors de la récupération du matériel :", error);
      }
    };

    fetchEquipment();
  }, []);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBeaconClick = (item) => {
    setSelectedEquipment(item);
    setShowCommentPopup(true);
  };

  const closeCommentPopup = () => {
    setShowCommentPopup(false);
  };

  return (
    <main className="main-content">
      <h2>Materiels</h2>
      <div className="equipment-list">
        {equipment.map((item) => (
          <div key={item.id} className="equipment-item">
            <img
              src={item.photo}
              alt={item.denomination}
              className="equipment-image"
              onClick={() => handleImageClick(item.photo)}
              style={{ cursor: 'pointer' }}
            />
            <div className="equipment-details">
              <div className="equipment-name">
                {item.denomination}
              </div>
              <p>Quantité: {item.quantity}</p>
              {item.documentation && (
                <a href={item.documentation} target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              )}
              <p>Affectation: {item.affection}</p>
              <p>Emplacement: {item.emplacement}</p>
            </div>
            {item.comment && (
              <div className="beacon" onClick={() => handleBeaconClick(item)}>
                <span className="beacon-icon">🚨</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={selectedImage} alt="Equipment Full Size" style={{ maxWidth: '90%', maxHeight: '90%' }} />
          </div>
        </div>
      )}

      {showCommentPopup && selectedEquipment && (
        <div className="modal">
          <div className="modal-content comment-modal">
            <span className="close" onClick={closeCommentPopup}>&times;</span>
            <div className="comment-header">
              {selectedEquipment.timestamp && selectedEquipment.grade && selectedEquipment.name && (
                <p className="comment-info">
                  {new Date(selectedEquipment.timestamp).toLocaleString()} - {selectedEquipment.grade} - {selectedEquipment.name}
                </p>
              )}
              {selectedEquipment.userPhoto && (
                <img
                  src={selectedEquipment.userPhoto}
                  alt="User"
                  className="comment-user-photo"
                />
              )}
            </div>
            <div className="comment-text">
              {selectedEquipment.comment}
            </div>
            <button className="close-button" onClick={closeCommentPopup}>Fermer</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Materiels;
