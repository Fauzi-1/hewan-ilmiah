// App.jsx
import React, { useState } from 'react';
import AppRoutes from './routes';
import AnimalModal from './pages/AnimalModal';

function App() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAnimalModal = (animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const closeAnimalModal = () => {
    setSelectedAnimal(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Routing dengan props modal */}
      <AppRoutes
        onOpenModal={openAnimalModal}
      />

      {/* Modal hewan global */}
      <AnimalModal
        isOpen={isModalOpen}
        onClose={closeAnimalModal}
        animal={selectedAnimal}
      />
    </>
  );
}

export default App;
