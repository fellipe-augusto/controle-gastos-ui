import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './SpendingChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export function SpendingChart({ title, data, dataLabelField }) {
  const chartData = {
    labels: data.map(item => item[dataLabelField]),
    datasets: [
      {
        label: 'Gasto (R$)',
        data: data.map(item => item.total),
        backgroundColor: [
          '#0d6efd', '#6c757d', '#198754', '#ffc107', '#dc3545',
          '#0dcaf0', '#fd7e14', '#d63384', '#6610f2'
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: { size: 18 }
      },
    },
  };
  
  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  );
}