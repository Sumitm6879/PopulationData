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

const createChart = (ctx, data) => {
    const xs = [];
    const ys = [];
    const backgroundColors = [];
    const borderColors = [];

    const filteredData = data.map(item => ({ country: item.country, pop: item['2023 population'] }));

    filteredData.forEach(item => {
        xs.push(item.country);
        ys.push(parseFloat(item.pop) / 1000000000);
        const color = getRandomColor();
        backgroundColors.push(color);
        borderColors.push(color);
    });

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xs,
            datasets: [{
                label: 'Population of Countries 2023',
                backgroundColor: backgroundColors,
                borderColor: borderColors,
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
                            return value + "B";
                        }
                    }
                }
            }
        }
    });
};

function BigGraph() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchAndCreateChart = async () => {
            const data = await getData();
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = createChart(ctx, data);
        };

        fetchAndCreateChart();
    }, []);

    return (
        <div className='center'>
            <h1>Top 10 Countries By Population</h1>
            <div className="container biggraph">
                <canvas id="myChart" ref={chartRef} height="500px"></canvas>
            </div>
        </div>
    );
}

export default BigGraph;
