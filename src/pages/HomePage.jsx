import React from 'react';
import Layout from '../components/Layout';

const HomePage = () => {
  return (
    <Layout>
      <div className="text-center mt-10">
        <h2 className="text-4xl font-semibold mb-6">Welcome to F1 Data Tracker</h2>
        <p className="text-lg text-gray-600 mb-4">Your one-stop hub for all Formula 1 statistics and updates.</p>
        <img 
          src={`https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Qatar`}
          alt="Formula 1 Circuit" 
          className="mx-auto rounded-lg shadow-md w-full max-w-2xl mb-6"
        />
        <p className="text-gray-600">Explore the latest race schedules, results, driver standings, and team rankings. Stay up-to-date with everything Formula 1!</p>
      </div>
    </Layout>
  );
};

export default HomePage;
