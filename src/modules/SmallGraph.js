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

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const createSmallChart1 = (ctx, countryData) => {
    const xs = ['1970', '1980', '1990', '2000', '2010', '2020', '2023'];
    const ys = xs.map(year => parseFloat(countryData[`${year} population`]) / 1000000);

    const backgroundColors = getRandomColor();
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: xs,
            datasets: [{
                label: `Population of ${countryData.country} Over the Years 1970-2023`,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                data: ys,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            return value + "M";
                        }
                    }
                }
            }
        }
    });
};

const createSmallChart2 = (ctx, countryData) => {
    const worldPercentage = parseFloat(countryData['world percentage'].replace("%", ''));

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [countryData.country, 'Rest of the World'],
            datasets: [{
                data: [worldPercentage, 100 - worldPercentage],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 205, 86, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

function SmallGraph() {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('India');
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    const chart1Instance = useRef(null);
    const chart2Instance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            const countryNames = data.map(item => item.country);
            setCountries(countryNames);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateCharts = async () => {
            const data = await getData();
            const countryData = data.find(item => item.country === selectedCountry);

            if (chart1Instance.current) {
                chart1Instance.current.destroy();
            }
            if (chart2Instance.current) {
                chart2Instance.current.destroy();
            }

            if (countryData) {
                chart1Instance.current = createSmallChart1(chart1Ref.current.getContext('2d'), countryData);
                chart2Instance.current = createSmallChart2(chart2Ref.current.getContext('2d'), countryData);
            }
        };

        updateCharts();
    }, [selectedCountry]);

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    return (
        <div>
            <h1 className='center d-flex justify-content-md-center mt-5'>Graphs of Individual Countries</h1>
            <div className="container d-flex justify-content-md-center mt-5">
                <select onChange={handleCountryChange} value={selectedCountry}>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </select>
            </div>
            <div className="container d-flex justify-content-md-evenly mt-5">
                <div className="container boxHeight">
                    <canvas className='smallchart1' ref={chart1Ref} id="smallchart1">small chart1</canvas>
                </div>
                <div className="container boxHeight">
                    <canvas className='smallchart2' ref={chart2Ref} id="smallchart2" height="300px">small chart2</canvas>
                </div>
            </div>
        </div>
    );
}

export default SmallGraph;
