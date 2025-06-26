import React from 'react';
import '../assets/styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AnimalEdu. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
