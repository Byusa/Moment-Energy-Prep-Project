import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components you are using
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        const response = await axios.get('/api/batteries');
        setBatteries(response.data);
      } catch (error) {
        console.error('Error fetching battery data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatteries();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Example data for Chart.js
  const chartData = {
    labels: batteries.map(b => b.Date),
    datasets: [
      {
        label: 'Battery Capacity',
        data: batteries.map(b => b.Capacity),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Voltage',
        data: batteries.map(b => b.Voltage),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Temperature',
        data: batteries.map(b => b.Temperature),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Value: ${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h2>Battery Dashboard</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Dashboard;
