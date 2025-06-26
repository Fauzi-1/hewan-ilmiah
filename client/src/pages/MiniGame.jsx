import React, { useState, useEffect } from 'react';
import axios from '../api/api';

const MiniGame = () => {
  const [animals, setAnimals] = useState([]);
  const [droppedItems, setDroppedItems] = useState({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const res = await axios.get('/animals');
      setAnimals(res.data);
    } catch (error) {
      console.error('Gagal mengambil data hewan:', error);
    }
  };

  const handleDragStart = (e, animalId) => {
    e.dataTransfer.setData('animalId', animalId);
  };

  const handleDrop = (e, habitat) => {
    e.preventDefault();
    const animalId = e.dataTransfer.getData('animalId');
    const animal = animals.find((a) => a._id === animalId);

    if (animal?.habitat === habitat) {
      setDroppedItems((prev) => ({ ...prev, [habitat]: animal }));
      setFeedback(`✅ ${animal.name} benar berada di ${habitat}`);
    } else {
      setFeedback(`❌ ${animal.name} bukan dari habitat ${habitat}`);
    }

    setTimeout(() => setFeedback(''), 2000);
  };

  const isDropped = (animalId) => {
    return Object.values(droppedItems).some((a) => a._id === animalId);
  };

  const uniqueHabitats = [...new Set(animals.map((a) => a.habitat))];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Mini Game: Tarik & Jatuhkan ke Habitat</h2>

      {feedback && (
        <div className="text-center mb-4 font-semibold text-blue-600">{feedback}</div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {animals.map((animal) =>
          !isDropped(animal._id) && (
            <div
              key={animal._id}
              draggable
              onDragStart={(e) => handleDragStart(e, animal._id)}
              className="w-28 border border-green-300 bg-green-50 rounded-md shadow p-2 text-center cursor-grab hover:bg-green-100 transition"
            >
              <img src={animal.image} alt={animal.name} className="h-20 object-cover mx-auto mb-1" />
              <p className="text-sm font-medium">{animal.name}</p>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uniqueHabitats.map((habitat) => (
          <div
            key={habitat}
            onDrop={(e) => handleDrop(e, habitat)}
            onDragOver={(e) => e.preventDefault()}
            className="min-h-[150px] p-4 border-2 border-yellow-400 rounded bg-yellow-50 text-center"
          >
            <h3 className="text-lg font-bold mb-2 text-yellow-600">{habitat}</h3>
            {droppedItems[habitat] && (
              <div className="flex flex-col items-center">
                <img
                  src={droppedItems[habitat].image}
                  alt={droppedItems[habitat].name}
                  className="w-20 h-20 object-cover mb-1 rounded"
                />
                <span className="font-medium">{droppedItems[habitat].name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniGame;
