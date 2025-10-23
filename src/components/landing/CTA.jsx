import React from 'react';

const CTA = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold">Ready to Take Control of Your Compliance?</h2>
        <p className="mt-4 text-lg">Sign up for a free 14-day trial today. No credit card required.</p>
        <button className="mt-8 px-10 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
          Start Your Free Trial
        </button>
      </div>
    </section>
  );
};

export default CTA;