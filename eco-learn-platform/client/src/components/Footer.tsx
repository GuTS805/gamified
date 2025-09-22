import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">GyanSetu</h3>
            <p className="text-gray-400">
              Empowering the next generation through gamified environmental education.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/lessons" className="text-gray-400 hover:text-white">Lessons</Link></li>
              <li><Link to="/challenges" className="text-gray-400 hover:text-white">Challenges</Link></li>
              <li><Link to="/leaderboard" className="text-gray-400 hover:text-white">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <span className="text-2xl">🌱</span>
              <span className="text-2xl">🌍</span>
              <span className="text-2xl">♻️</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GyanSetu. All rights reserved. Made with ❤️ for the planet.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
