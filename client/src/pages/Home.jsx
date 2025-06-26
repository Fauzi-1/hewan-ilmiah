import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/api'; // pastikan baseURL sudah di-setup

const Home = () => {
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    const fetchRandomHeroImage = async () => {
      try {
        const res = await axios.get('/animals'); // sesuaikan endpoint backend
        const animals = res.data;

        if (animals.length > 0) {
          const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
          setHeroImage(randomAnimal.image); // URL Cloudinary langsung
        }
      } catch (error) {
        console.error('Gagal mengambil data hewan:', error);
      }
    };

    fetchRandomHeroImage();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 py-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800">
            Selamat Datang di Dunia Hewan Langka!
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Mari belajar dan bermain sambil mengenal hewan-hewan yang hampir punah 🌱
          </p>
          <Link
            to="/animals"
            className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Eksplorasi Sekarang
          </Link>
        </div>
        <div className="md:w-1/2">
          {heroImage ? (
            <img src={heroImage} alt="Hewan Langka" className="w-full h-auto rounded shadow" />
          ) : (
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded" />
          )}
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="mt-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6 text-green-700">Fitur</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Link to="/animals" className="bg-white border border-green-200 shadow rounded-lg p-6 hover:bg-green-50 transition">
            🐯 <span className="block mt-2 font-medium">Daftar Hewan</span>
          </Link>
          <Link to="/quiz" className="bg-white border border-green-200 shadow rounded-lg p-6 hover:bg-green-50 transition">
            🧠 <span className="block mt-2 font-medium">Kuis</span>
          </Link>
          <Link to="/chatbot" className="bg-white border border-green-200 shadow rounded-lg p-6 hover:bg-green-50 transition">
            🤖 <span className="block mt-2 font-medium">Chatbot</span>
          </Link>
          <Link to="/minigame" className="bg-white border border-green-200 shadow rounded-lg p-6 hover:bg-green-50 transition">
            🎮 <span className="block mt-2 font-medium">Mini Game</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
