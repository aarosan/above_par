import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArcElement } from 'chart.js';

export const BarGamesByMonth = ({ games }) => {
    //console.log('BarGamesByMonth', games)

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

    const monthNumberToName = (monthPlayCount) => {
        const monthNames = {
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June',
            '07': 'July',
            '08': 'August',
            '09': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        };

        const newMonthPlayCount = {};
        Object.keys(monthPlayCount).forEach(month => {
            const monthName = monthNames[month];
            if (monthName) {
                newMonthPlayCount[monthName] = monthPlayCount[month];
            }
        });
        return newMonthPlayCount;
    }

    const generateBarChartData = (games) => {
        const monthPlayCount = games.reduce((acc, game) => {
            const month = game.date.slice(5, 7);
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const namedMonthPlayCount = monthNumberToName(monthPlayCount);
        //console.log('namedMonthPlayCount', namedMonthPlayCount);

        const labels = Object.keys(namedMonthPlayCount);
        //console.log('labels', labels);
        const data = Object.values(namedMonthPlayCount);
        //console.log('data', data);

        const datasets = [{
            label: 'Games Played by Month',
            data: data,
            backgroundColor: labels.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.5)`),
            borderColor: labels.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`),
            borderWidth: 1,
        }];

        return {
            labels,
            datasets,
        };
    }

    const barChartData = generateBarChartData(games);

    return (
        <div>
            <Bar 
                    data={barChartData} 
                    options={{ 
                        responsive: true, 
                        plugins: { 
                            legend: { position: 'top' }, 
                            title: { display: true, text: `Games Played by Month` } 
                        } 
                    }} 
            />
        </div>
    );
}

