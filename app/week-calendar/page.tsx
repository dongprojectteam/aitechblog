import React from 'react';
import WeekCalendar from '@/components/WeekCalendar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <WeekCalendar />
    </div>
  );
};

export default Home;