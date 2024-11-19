import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArcElement } from 'chart.js';

export const BarHoleNumber = ({ userData }) => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
    
    const generateBarChartData = (userData) => {
        //console.log('barHoleNumber', userData);

        const courses = userData.courses
        //console.log('courses', courses);

        const holeCounts = courses.reduce((acc, course) => {
            const holes = course.numberOfHoles;
            acc[holes] = (acc[holes] || 0) + 1;
            return acc;
        }, {});

        //console.log('holeCounts', holeCounts);

        const labels = Object.keys(holeCounts);
        //console.log('labels', labels);
        const data = Object.values(holeCounts);
        //console.log('data', data);

        const datasets = [{
            label: "Courses by Total Hole Number",
            data: data,
            backgroundColor: labels.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.5)`),
            borderColor: labels.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`),
            borderWidth: 1,
        }];

        return {
            labels,
            datasets,
        };

    };

    const barChartData = generateBarChartData(userData);

    return (
        <div>
            <Bar 
                    data={barChartData} 
                    options={{ 
                        responsive: true, 
                        plugins: { 
                            legend: { position: 'top' }, 
                            title: { display: true, text: `Courses by Hole Number` } 
                        } 
                    }} 
            />  
        </div>
    );
}