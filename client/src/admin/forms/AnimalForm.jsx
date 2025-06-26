import React, { useState, useEffect } from 'react';
import axios from '../../api/api';

const AnimalForm = ({ selectedAnimal, fetchAnimals, onReset }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    habitat: '',
    conservationStatus: '',
    image: null,
    sound: null,
  });

  useEffect(() => {
    if (selectedAnimal) {
      setFormData({
        name: selectedAnimal.name || '',
        description: selectedAnimal.description || '',
        habitat: selectedAnimal.habitat || '',
        conservationStatus: selectedAnimal.conservationStatus || '',
        image: null,
        sound: null,
      });
    } else {
      resetForm();
    }
  }, [selectedAnimal]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      habitat: '',
      conservationStatus: '',
      image: null,
      sound: null,
    });
    if (onReset) onReset();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('habitat', formData.habitat);
      payload.append('conservationStatus', formData.conservationStatus);
      if (formData.image) payload.append('image', formData.image);
      if (formData.sound) payload.append('sound', formData.sound);

      if (selectedAnimal) {
        await axios.put(`/animals/${selectedAnimal._id}`, payload, config);
      } else {
        await axios.post('/animals', payload, config);
      }

      fetchAnimals();
      resetForm();
    } catch (error) {
      console.error('Gagal menyimpan data hewan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nama Hewan"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Deskripsi"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="text"
        name="habitat"
        placeholder="Habitat"
        value={formData.habitat}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="text"
        name="conservationStatus"
        placeholder="Status Konservasi"
        value={formData.conservationStatus}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <input
        type="file"
        name="sound"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {selectedAnimal ? 'Update Hewan' : 'Tambah Hewan'}
        </button>
        {selectedAnimal && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default AnimalForm;
