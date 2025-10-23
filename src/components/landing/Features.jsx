import React from 'react';
import { FaTasks, FaBell, FaFileAlt } from 'react-icons/fa';

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 text-blue-600 rounded-full">
              <FaTasks size={32} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Task Tracking</h3>
            <p className="text-center text-gray-600">Monitor all your compliance tasks in one place, with a clear and intuitive interface.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 text-blue-600 rounded-full">
              <FaBell size={32} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Automated Reminders</h3>
            <p className="text-center text-gray-600">Never miss a deadline with our automated email and in-app reminders.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 text-blue-600 rounded-full">
              <FaFileAlt size={32} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Compliance Reports</h3>
            <p className="text-center text-gray-600">Generate detailed compliance reports with a single click, ready for auditing.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;