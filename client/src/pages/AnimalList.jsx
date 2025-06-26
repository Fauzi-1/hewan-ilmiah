import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('/animals');
        setAnimals(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal mengambil data hewan:', error);
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Memuat data hewan...</p>;
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Daftar Hewan Langka</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {animals.map((animal) => (
          <div
            key={animal._id}
            className="bg-white shadow-md rounded-lg p-4 border border-green-200 hover:shadow-lg transition"
          >
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold text-green-700 mb-1">{animal.name}</h3>
            <p className="text-sm text-gray-600"><strong>Habitat:</strong> {animal.habitat}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> {animal.conservationStatus}</p>
            <p className="text-sm mt-2 text-gray-700">{animal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalList;
