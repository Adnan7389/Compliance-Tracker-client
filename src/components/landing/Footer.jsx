import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>&copy; 2025 Compliance Tracker. All rights reserved.</p>
            <p className="text-sm text-gray-400">Made with ❤️ for small businesses.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaLinkedin size={24} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;