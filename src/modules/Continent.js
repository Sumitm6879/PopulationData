// src/ContinentChart.js
import React, { useEffect, useState, useRef } from 'react';
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



const createContinentChart = (ctx, data, year, gcolor) => {
    const continentPopulations = {};
    
    data.forEach(item => {
        const continent = item.continent;
        const population = item[`${year} population`];
        if (continentPopulations[continent]) {
            continentPopulations[continent] += population;
        } else {
            continentPopulations[continent] = population;
        }
    });

    const xs = Object.keys(continentPopulations);
    const ys = Object.values(continentPopulations).map(pop => pop); // Convert to millions for readability

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xs,
            datasets: [{
                label: `Population of Continents in ${year}`,
                backgroundColor: gcolor,
                borderColor: 'black',
                data: ys,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            if (value >= 1e9) {
                                return (value / 1e9).toFixed(1) + 'B';
                            } else if (value >= 1e6) {
                                return (value / 1e6).toFixed(1) + 'M';
                            } else if (value >= 1e3) {
                                return (value / 1e3).toFixed(1) + 'K';
                            } else {
                                return value;
                            }
                        }
                    }
                }
            }
        }
    });
};

function Continent(props) {
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('2023');
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const gcolor = props.gcolor

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await getData();
            setData(fetchedData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = createContinentChart(ctx, data, selectedYear, gcolor);
        }
    }, [data, selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    return (
        <div className='center mt-5 mb-5'>
            <h1>Population by Continent</h1>
            <div className="container d-flex justify-content-md-center mt-3">
                <select onChange={handleYearChange} value={selectedYear}>
                    {['1970', '1980', '1990', '2000', '2010', '2020', '2023'].map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="container biggraph mt-3">
                <canvas id="myChart" ref={chartRef} height="500px"></canvas>
            </div>
        </div>
    );
}

export default Continent;
