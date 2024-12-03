import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics: React.FC = () => {
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ventas',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Compras',
        data: [1000, 1500, 2800, 4000, 1700, 2500],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Estadísticas Mensuales' },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Statistics;
