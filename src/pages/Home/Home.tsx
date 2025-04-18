
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Home: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">O'quvchilar</h3>
          <p className="text-3xl font-bold text-primary mt-2">{stats?.studentsCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">O'qituvchilar</h3>
          <p className="text-3xl font-bold text-primary mt-2">{stats?.teachersCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Guruhlar</h3>
          <p className="text-3xl font-bold text-primary mt-2">{stats?.groupsCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Daromad</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.totalIncome}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
