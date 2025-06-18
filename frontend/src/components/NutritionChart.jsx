import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionChart = ({ data }) => {
  // console.log("NutritionChart data:", data.protein.per_100g.split(' ')[0] );
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          data.protein.per_100g.split(' ')[0] || 0,
          data.carbohydrates.per_100g.split(' ')[0] || 0,
          data.fat.per_100g.split(' ')[0] || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280', // gray-500
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            // const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}g `;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default NutritionChart;