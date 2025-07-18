import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#004d40] to-[#26a69a] shadow-md px-6 py-3">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-white text-2xl font-bold font-sans hover:opacity-80 transition"
        >
          AnimalEdu
        </Link>

        {/* Hamburger Button */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex gap-6 list-none m-0">
            {[
              ['/', 'Beranda'],
              ['/animals', 'Hewan'],
              ['/quiz', 'Kuis'],
              ['/minigame', 'Game'],
              ['/chatbot', 'Chatbot'],
            ].map(([path, label]) => (
              <li
                key={path}
                className="transform transition-transform duration-200 hover:scale-110"
              >
                <Link
                  to={path}
                  className="text-white font-medium px-3 py-1 rounded hover:bg-white/20 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="flex flex-col gap-3 mt-3 bg-gradient-to-r from-[#004d40] to-[#26a69a]/90 p-4 rounded-bl-xl md:hidden">
          {[
            ['/', 'Beranda'],
            ['/animals', 'Hewan'],
            ['/quiz', 'Kuis'],
            ['/minigame', 'Game'],
            ['/chatbot', 'Chatbot'],
          ].map(([path, label]) => (
            <li key={path}>
              <Link
                to={path}
                className="text-white block font-medium px-3 py-1 rounded hover:bg-white/20 transition"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
