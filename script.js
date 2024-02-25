document.addEventListener('DOMContentLoaded', function() {
    const lineChart = document.getElementById('lineChart').getContext('2d');
    const barChart = document.getElementById('barChart').getContext('2d');
    const scatterChart = document.getElementById('scatterChart').getContext('2d');

    fetch('https://data.covid19india.org/v4/min/timeseries.min.json')
        .then(response => response.json())
        .then(data => {
            const state = 'MH'; // Set default state to Maharashtra (or any state you prefer)
            const dates = Object.keys(data[state]['dates']).slice(-30); // Fetch data for the last 30 days

            const confirmedCases = [];
            const activeCases = [];
            const recoveredCases = [];
            const deceasedCases = [];

            dates.forEach(date => {
                confirmedCases.push(data[state]['dates'][date]['total']['confirmed']);
                activeCases.push(data[state]['dates'][date]['total']['confirmed'] - data[state]['dates'][date]['total']['recovered'] - data[state]['dates'][date]['total']['deceased']);
                recoveredCases.push(data[state]['dates'][date]['total']['recovered']);
                deceasedCases.push(data[state]['dates'][date]['total']['deceased']);
            });

            new Chart(lineChart, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Confirmed Cases',
                        data: confirmedCases,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            new Chart(barChart, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Active Cases',
                        data: activeCases,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                   ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true
                        }
                    }
                }
            });

            new Chart(scatterChart, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Recovered vs. Deceased Cases',
                        data: recoveredDeceasedData(data[state]['dates'], dates),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Recovered Cases'
                            }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Deceased Cases'
                            }
                        }
                    }
                }
            });
        });

    function recoveredDeceasedData(datesData, selectedDates) {
        const data = [];
        for (const date of selectedDates) {
            const recovered = datesData[date].total.recovered || 0;
            const deceased = datesData[date].total.deceased || 0;
            data.push({x: recovered, y: deceased});
        }
        return data;
    }
});

