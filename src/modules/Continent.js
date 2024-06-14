// src/PopulationChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const apiurl = "http://127.0.0.1:5000/data/all";

const getData = async () => {
    try {
        const response = await fetch(apiurl);
        if (!response.ok) {
            throw new Error("Response not good");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
};

const Continent = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const data = await getData();
            const continentPopulation = {};

            data.forEach(country => {
                const { continent, '2023 population': population } = country;
                if (continentPopulation[continent]) {
                    continentPopulation[continent] += population;
                } else {
                    continentPopulation[continent] = population;
                }
            });

            const labels = Object.keys(continentPopulation);
            const populations = Object.values(continentPopulation);

            setChartData({
                labels,
                datasets: [{
                    label: 'Population in 2023',
                    data: populations,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            });
        };

        fetchAndProcessData();
    }, []);

    return (
        <div>
            <h2>Population by Continent in 2023</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default Continent;
