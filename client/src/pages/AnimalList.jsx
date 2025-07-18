import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import bgAnimal from '../assets/hero_bg.jpg';

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('/animals');
        setAnimals(response.data);
      } catch (error) {
        console.error('Gagal mengambil data hewan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const closeDetail = () => {
    setSelectedAnimal(null);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-gray-600 text-lg"
        style={{ backgroundImage: `url(${bgAnimal})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        Memuat data hewan...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4 text-gray-800"
      style={{ backgroundImage: `url(${bgAnimal})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white/80 rounded-xl max-w-6xl mx-auto p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
          Daftar Hewan Langka
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div
              key={animal._id}
              onClick={() => setSelectedAnimal(animal)}
              className="cursor-pointer bg-white shadow-md rounded-lg p-4 border border-green-200 hover:shadow-lg transform transition duration-200 ease-in-out active:scale-95 active:rotate-1"
            >
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700 mb-1">
                {animal.name}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Habitat:</strong> {animal.habitat}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {animal.conservationStatus}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail */}
        {selectedAnimal && (
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
                <h3 className="text-lg font-semibold text-green-800">
                  Detail Hewan
                </h3>
                <button
                  onClick={closeDetail}
                  className="text-gray-500 hover:text-red-600 text-2xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
                <div className="mb-6">
                  <img
                    src={selectedAnimal.image}
                    alt={selectedAnimal.name}
                    className="w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg shadow mx-auto"
                  />
                </div>
                <h2 className="text-3xl font-bold text-green-700 mb-3">
                  {selectedAnimal.name}
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Habitat:</strong> {selectedAnimal.habitat}</p>
                  <p><strong>Status Konservasi:</strong> {selectedAnimal.conservationStatus}</p>
                  <div className="pt-2 leading-relaxed text-justify space-y-2">
                    {selectedAnimal.description.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default AnimalList;
