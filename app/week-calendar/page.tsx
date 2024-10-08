'use client'

import React, { useState, useEffect } from 'react'
import WeekCalendar from '@/components/WeekCalendar';
import { incrementVisits } from '@/lib/incrementVisits';

const Home: React.FC = () => {
  useEffect(() => {
    incrementVisits('/week-calendar')
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <WeekCalendar />
    </div>
  );
};

export default Home;