import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

/**
 * Design Summary:
 *
 * Color Choices:
 * The color palette is designed to be clean, professional, and trustworthy. The primary color is a calming blue (#3B82F6), which is often associated with trust, security, and reliability. This is used for CTAs and highlights to draw the user's attention to key actions. The rest of the palette consists of soft grays and whites to create a clean and balanced layout with plenty of white space.
 *
 * Layout Logic:
 * The layout is a single-page design with a clear visual hierarchy. The sections are arranged in a logical order, starting with a strong hero section to grab the user's attention, followed by features, how it works, testimonials, and a final CTA. The layout is fully responsive and uses a 12-column grid system for consistency.
 *
 * UX Principles:
 * - Clarity: The landing page clearly communicates the product's value proposition and encourages users to take action.
 * - Simplicity: The design is simple and easy to navigate, with a clear and intuitive user flow.
 * - Consistency: The design is consistent throughout the page, with a consistent color palette, typography, and spacing.
 * - Feedback: The UI provides visual feedback to the user on hover and click events, creating a more interactive and engaging experience.
 */
const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <Header />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;