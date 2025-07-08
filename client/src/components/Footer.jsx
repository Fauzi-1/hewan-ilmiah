import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#004d40] to-[#26a69a] text-white text-center py-4 shadow-md">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="font-semibold">AnimalEdu</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

