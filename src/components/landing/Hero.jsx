import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center bg-gray-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">Streamline Your Compliance, Unleash Your Growth</h1>
          <p className="mt-4 text-lg text-gray-600">Stay on top of your compliance requirements with ease, so you can focus on what matters most: growing your business.</p>
          <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Get Started for Free
          </button>
        </div>
        <div className="md:w-1/2">
          <img src="https://placehold.co/1200x800/EBF4FF/7F9CF5?text=Compliance+Dashboard" alt="Compliance Dashboard" className="rounded-lg shadow-2xl" />
        </div>
      </div>
    </section>
  );
};

export default Hero;