import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimalModal from '../components/AnimalModal';

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('/api/animals');
        setAnimals(response.data);
      } catch (error) {
        console.error('Gagal mengambil data hewan:', error);
      }
    };
    fetchAnimals();
  }, []);

  const openDetail = (animal) => {
    setSelectedAnimal(animal);
  };

  const closeDetail = () => {
    setSelectedAnimal(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Daftar Hewan Langka</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {animals.map((animal) => (
          <div
            key={animal._id}
            onClick={() => openDetail(animal)}
            className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col items-center text-center"
          >
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-40 object-contain mb-4 rounded"
            />
            <h2 className="text-xl font-semibold text-green-800">{animal.name}</h2>
          </div>
        ))}
      </div>

      {/* Modal untuk detail hewan */}
      <AnimalModal
        isOpen={!!selectedAnimal}
        onClose={closeDetail}
        animal={selectedAnimal}
      />
    </div>
  );
};

export default AnimalList;
