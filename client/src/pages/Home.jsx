import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/api';
import backgroundImage from '../assets/hero_bg.jpg';

const Home = () => {
  const [heroImage, setHeroImage] = useState('');
  const navigate = useNavigate();
  const routes = ['/animals', '/quiz', '/chatbot', '/minigame'];

  useEffect(() => {
    const fetchRandomHeroImage = async () => {
      try {
        const res = await axios.get('/animals');
        const animals = res.data;
        if (animals.length > 0) {
          const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
          setHeroImage(randomAnimal.image);
        }
      } catch (error) {
        console.error('Gagal mengambil data hewan:', error);
      }
    };

    fetchRandomHeroImage();
  }, []);

  const handleRandomNavigate = () => {
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    navigate(randomRoute);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay & Konten */}
      <div className="w-full max-w-6xl bg-white/70 rounded-2xl p-10 md:p-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Gambar di kiri */}
        <div className="w-full md:w-1/2">
          {heroImage ? (
            <img
              src={heroImage}
              alt="Hewan Langka"
              className="w-full h-auto rounded-xl shadow-md border border-green-300"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl" />
          )}
        </div>

        {/* Teks Hero di kanan */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 leading-tight">
            Selamat Datang di Dunia Hewan Langka!
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-700">
            Mari belajar dan bermain sambil mengenal hewan-hewan yang hampir punah.
          </p>
          <button
            onClick={handleRandomNavigate}
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            🎉 Eksplorasi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
