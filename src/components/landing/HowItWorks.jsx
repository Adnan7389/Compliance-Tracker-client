import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-center">
            {/* Step 1 */}
            <div className="text-center w-full md:w-1/3 p-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-blue-600 text-blue-600 rounded-full text-2xl font-bold shadow-lg">1</div>
              <h3 className="mt-6 text-xl font-bold">Register</h3>
              <p className="mt-2 text-gray-600">Create your account in minutes and set up your business profile.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center w-full md:w-1/3 p-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-blue-600 text-blue-600 rounded-full text-2xl font-bold shadow-lg">2</div>
              <h3 className="mt-6 text-xl font-bold">Add Tasks & Deadlines</h3>
              <p className="mt-2 text-gray-600">Input your compliance tasks and their deadlines into the system.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center w-full md:w-1/3 p-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-blue-600 text-blue-600 rounded-full text-2xl font-bold shadow-lg">3</div>
              <h3 className="mt-6 text-xl font-bold">Track & Comply</h3>
              <p className="mt-2 text-gray-600">Monitor your progress, receive reminders, and stay compliant.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;