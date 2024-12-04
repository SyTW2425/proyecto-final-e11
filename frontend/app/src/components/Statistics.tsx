import React, { useEffect, useState } from 'react';
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
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] } | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:5000/estadisticas');
        const { ventas, compras } = await response.json();

        // Crear un conjunto único de etiquetas (meses)
        const uniqueLabels = Array.from(
          new Set([...ventas.map((v: { _id: string }) => v._id), ...compras.map((c: { _id: string }) => c._id)])
        ).sort(); // Ordenar etiquetas por fecha

        // Generar datos para la gráfica
        const ventasData = uniqueLabels.map(
          label => ventas.find((v: { _id: string; importe_: number }) => v._id === label)?.importe_ || 0
        );
        const comprasData = uniqueLabels.map(
          label => compras.find((c: { _id: string; importe_: number }) => c._id === label)?.importe_ || 0
        );

        // Configurar datos para Chart.js
        setChartData({
          labels: uniqueLabels,
          datasets: [
            {
              label: 'Ventas',
              data: ventasData,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
              label: 'Compras',
              data: comprasData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchStatistics();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Estadísticas Mensuales' },
    },
    scales: {
      y: {
        beginAtZero: true, // Asegurar que el eje Y comience en 0
        ticks: {
          stepSize: 500, // Escalar los pasos según los datos
        },
      },
      x: {
        ticks: {
          maxRotation: 45, // Rotar etiquetas si son largas
          minRotation: 0,
        },
      },
    },
  };

  if (!chartData) return <p>Cargando datos...</p>;

  return <Bar data={chartData} options={options} />;
};

export default Statistics;
