import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import heroBg from '../assets/hero_bg.jpg';

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const MiniGame = () => {
  const [animals, setAnimals] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const res = await axios.get('/animals');
      setAnimals(res.data);
      const uniqueHabitats = [...new Set(res.data.map((a) => a.habitat))];
      setHabitats(shuffleArray(uniqueHabitats));
      setSelectedAnimal(null);
      setMatchedPairs({});
    } catch (error) {
      console.error('Gagal mengambil data hewan:', error);
    }
  };

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleHabitatClick = (habitat) => {
    if (!selectedAnimal) return;

    if (selectedAnimal.habitat === habitat) {
      setMatchedPairs((prev) => ({ ...prev, [selectedAnimal._id]: habitat }));
      setFeedback(`✅ ${selectedAnimal.name} cocok dengan habitat ${habitat}`);
    } else {
      setFeedback(`❌ ${selectedAnimal.name} bukan dari habitat ${habitat}`);
    }

    setTimeout(() => {
      setFeedback('');
      setSelectedAnimal(null);
    }, 2000);
  };

  const isMatched = (animalId) => matchedPairs.hasOwnProperty(animalId);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-2 text-green-700">
          Mini Game: Cocokkan Hewan dan Habitat
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Cocokan semua hewan dengan habitat aslinya!
        </p>
        <p className="text-center text-sm text-green-800 mb-4">
          {Object.keys(matchedPairs).length} dari {animals.length} hewan telah cocok ✅
        </p>

        {feedback && (
          <div className="text-center mb-4 font-semibold text-blue-600 animate-pulse">
            {feedback}
          </div>
        )}

        {/* Pilihan hewan */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 justify-center mb-8">
          {animals.map((animal) =>
            !isMatched(animal._id) && (
              <button
                key={animal._id}
                onClick={() => handleAnimalClick(animal)}
                className={`transition-all duration-300 border-2 rounded-lg p-2 text-center shadow-md
                  ${
                    selectedAnimal?._id === animal._id
                      ? 'border-green-500 bg-green-100 scale-150'
                      : 'border-green-300 bg-white hover:bg-green-50 hover:scale-105'
                  }`}
              >
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="h-20 w-full object-cover rounded mb-2"
                />
                <p className="text-sm font-semibold text-green-800">{animal.name}</p>
              </button>
            )
          )}
        </div>

        {/* Pilihan habitat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {habitats.map((habitat, idx) => (
            <button
              key={idx}
              onClick={() => handleHabitatClick(habitat)}
              className="min-h-[100px] border-2 border-yellow-400 bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-yellow-200 transition-all text-center"
            >
              <h3 className="text-lg font-bold text-yellow-800">{habitat}</h3>
              {Object.values(matchedPairs).includes(habitat) && (
                <p className="text-sm text-green-800 mt-2">✔️ Sudah Cocok</p>
              )}
            </button>
          ))}
        </div>

        {/* Tombol ulangi */}
        <div className="text-center mt-10">
          <button
            onClick={fetchAnimals}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            🔁 Ulangi Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
