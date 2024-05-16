import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import './Custom.css'; // Import the CSS file for additional styling

ChartJS.register(ArcElement, Tooltip, Legend);

const Custom = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://cs464p564-frontend-api.vercel.app/api/countries')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          const countryData = response.data.map(country => {
            if (country.name === 'French Guiana') {
              // Substitute GDP value for French Guinea with 4
              return { ...country, gdp_billions: 4 };
            }
            return country;
          });

          const countryNames = countryData.map(country => country.name);
          const gdpPerCapita = countryData.map(country => (country.gdp_billions / country.population) * 1000000);

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
                label: 'GDP per Capita',
                data: gdpPerCapita,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('70%', '100%')), // Border color as a slightly different shade
                borderWidth: 1,
              },
            ],
          });
          setLoading(false);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2 className="text-center">GDP per Capita of Countries</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="chart-container">
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = chartData.datasets[0].data[context.dataIndex] || 0;
                          console.log(`Label: ${label}, Value: ${value}`); // Log the value for debugging
                          return `${label}: $${value.toLocaleString()}`;
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
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Custom;
