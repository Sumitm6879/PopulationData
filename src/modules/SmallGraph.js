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

const createSmallChart1 = (ctx, countryData, gcolor) => {
    const xs = ['1970', '1980', '1990', '2000', '2010', '2020', '2023'];
    const ys = xs.map(year => (parseFloat(countryData[`${year} population`])));

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: xs,
            datasets: [{
                label: `Population of ${countryData.country} Over the Years 1970-2023`,
                backgroundColor: gcolor,
                borderColor: gcolor,
                pointBackgroundColor: "black",
                data: ys,
                borderWidth: 2,
                fill: false,
                tension:.4
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

const createSmallChart2 = (ctx, countryData,gcolor) => {
    const worldPercentage = parseFloat(countryData['world percentage'].replace("%", ''));

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [`${countryData.country} ${worldPercentage}%`, `Rest of the World ${100-worldPercentage}%`],
            datasets: [{
                data: [worldPercentage, 100 - worldPercentage],
                backgroundColor: [gcolor, 'rgba(255, 205, 86, 0.2)'],
                borderColor: [gcolor, 'rgba(255, 205, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

function SmallGraph(props) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('India');
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    const chart1Instance = useRef(null);
    const chart2Instance = useRef(null);
    const gcolor = props.gcolor;

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
                chart1Instance.current = createSmallChart1(chart1Ref.current.getContext('2d'), countryData, gcolor);
                chart2Instance.current = createSmallChart2(chart2Ref.current.getContext('2d'), countryData, gcolor);
            }
        };

        updateCharts();
    }, [selectedCountry]);

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    return (
        <div className='mb-5 mt-5'>
            <h1 className='center d-flex justify-content-md-center mt-5'>Graphs of Individual Countries</h1>
            <div className="container d-flex justify-content-md-center mt-5">
                <select onChange={handleCountryChange} value={selectedCountry}>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </select>
            </div>
            <div className="container d-flex justify-content-md-evenly mt-3">
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
