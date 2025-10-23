import React from 'react';

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
            <p className="text-gray-600 italic mb-6">"This app has been a lifesaver for my small business. I can finally keep track of all my compliance requirements in one place."</p>
            <div className="flex items-center">
              <img src="https://placehold.co/100x100/EBF4FF/7F9CF5?text=JD" alt="John Doe" className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200" />
              <div>
                <p className="font-bold text-gray-800">John Doe</p>
                <p className="text-sm text-gray-500">CEO, Example Inc.</p>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
            <p className="text-gray-600 italic mb-6">"I love the automated reminders. I never have to worry about missing a deadline again."</p>
            <div className="flex items-center">
              <img src="https://placehold.co/100x100/EBF4FF/7F9CF5?text=JS" alt="Jane Smith" className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200" />
              <div>
                <p className="font-bold text-gray-800">Jane Smith</p>
                <p className="text-sm text-gray-500">Owner, Smith & Co.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;