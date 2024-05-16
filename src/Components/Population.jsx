import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Population.css'; // Import the CSS file for styling

ChartJS.register(ArcElement, Tooltip, Legend);

const Population = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get('https://cs464p564-frontend-api.vercel.app/api/countries')
      .then(response => {
        console.log('API response:', response.data); // Debug: log the API response

        if (response.data && Array.isArray(response.data)) {
          const countryNames = response.data.map(country => country.name);
          const populations = response.data.map(country => {
            // Add debug log for each country's population
            console.log(`Country: ${country.name}, Population: ${country.population}`);
            return country.population;
          });

          // Generate a color palette
          const generateColors = (numColors) => {
            const colors = [];
            const baseHue = 360 / numColors;
            for (let i = 0; i < numColors; i++) {
              const hue = i * baseHue;
              colors.push(`hsl(${hue}, 70%, 50%)`);
            }
            return colors;
          };

          const colors = generateColors(countryNames.length);

          setChartData({
            labels: countryNames,
            datasets: [
              {
                label: 'Population',
                data: populations,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('70%', '100%')), // Border color as a slightly different shade
                borderWidth: 1,
              },
            ],
          });

          // Debug: log the chart data
          console.log('Chart Data:', {
            labels: countryNames,
            datasets: [
              {
                label: 'Population',
                data: populations,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('70%', '100%')),
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Population of Countries</h2>
      {chartData.labels ? (
        <div className="chart-container" style={{ height: '600px', width: '600px' }}>
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      return `Population: ${value.toLocaleString()}`;
                    }
                  }
                },
                legend: {
                  position: 'bottom',
                }
              }
            }}
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Population;



