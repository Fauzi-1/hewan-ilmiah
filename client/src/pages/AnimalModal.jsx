import React from 'react';
import bgAnimal from '../assets/hero_bg.jpg';

const AnimalModal = ({ isOpen, onClose, animal }) => {
  if (!isOpen || !animal) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgAnimal})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-xl w-full max-w-3xl mx-2 sm:mx-4 md:mx-6 shadow-lg relative overflow-hidden">
        <div className="sticky top-0 bg-white/90 z-50 border-b border-gray-200 px-4 py-3 shadow-sm flex justify-between items-center rounded-t-xl">
          <h3 className="text-lg font-semibold text-green-800">Detail Hewan</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          <div className="mb-6">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg shadow mx-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-3">{animal.name}</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>Habitat:</strong> {animal.habitat}</p>
            <p><strong>Status Konservasi:</strong> {animal.conservationStatus}</p>
            <div className="pt-2 leading-relaxed text-justify space-y-2">
              {animal.description?.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalModal;
