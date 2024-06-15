import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const apiurl = "http://127.0.0.1:5000/data";

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

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const createChart = (ctx, data, gcolor) => {
    const xs = [];
    const ys = [];


    const filteredData = data.map(item => ({ country: item.country, pop: item['2023 population'] }));

    filteredData.forEach(item => {
        xs.push(item.country);
        ys.push(parseFloat(item.pop));
    });

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xs,
            datasets: [{
                label: 'Population of Countries 2023',
                backgroundColor: gcolor,
                borderColor: 'black',
                data: ys,
                borderWidth: 2
            },
            {
                label: 'Population of Countries 2023 (Area)',
                type: 'line',
                data: ys,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.25)', // 25% opacity red color
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }
            ]},
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

function BigGraph(props) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const gcolor = props.gcolor;

    useEffect(() => {
        const fetchAndCreateChart = async () => {
            const data = await getData();
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = createChart(ctx, data, gcolor);
        };

        fetchAndCreateChart();
    }, []);

    return (
        <div className='center mt-5 mb-5'>
            <h1>Top 10 Countries By Population</h1>
            <div className="container biggraph">
                <canvas id="myChart" ref={chartRef} height="500px"></canvas>
            </div>
        </div>
    );
}

export default BigGraph;
