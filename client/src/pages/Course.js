import React, { useState } from "react";
import "../style/Course.css";
import { useNavigate } from "react-router-dom";
import ColorGrid from "../components/ColorGrid";

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Course = () => {
    const [newCourse, setNewCourse] = useState({
        courseName: "",
        numberOfHoles: 0,
        holes: [],
        totalPar: 0,
        color: "",
        createdBy: ""
    });

    const navigate = useNavigate();

    // Sets up Course Name, Number Of Holes, and Dynamic HoleNumber/Par
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewCourse((prev) => ({
            ...prev,
            [name]: name === "numberOfHoles" ? Number(value) : value,
        }));

        // Dynamically set up holes array based on numberOfHoles input
        if (name === "numberOfHoles") {
            const holesArray = Array.from({ length: value }, (_, i) => ({
                holeNumber: i + 1,
                par: "",  // Start with empty string
            }));
            setNewCourse((prev) => ({
                ...prev,
                holes: holesArray,
                totalPar: 0, // Reset total
            }));
        }
    };

    // Saves Par per Hole on blur and calculates total par
    const handleHoleBlur = (index, par) => {
        const updatedHoles = newCourse.holes.map((hole, i) =>
            i === index ? { ...hole, par: par === "" ? null : Number(par) } : hole // Save null for empty input
        );

        const totalPar = updatedHoles.reduce((sum, hole) => sum + (hole.par || 0), 0); // Calculate total par

        setNewCourse((prev) => ({
            ...prev,
            holes: updatedHoles,
            totalPar, // Update totalPar
        }));
    };

    // Post Course to API
    const postCourse = async () => {

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiUrl}/api/users/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newCourse),
            });

            if (!response.ok) throw new Error("Failed to create course");

            const data = await response.json();
            //console.log('Course added Successfully', data);
            navigate("/");
        } catch {
            console.error("Failed to create course");
        }
    };

    // Saves selected color and createdBy from local storage
    const handleSelectColor = (colorName) => {
        const userId = localStorage.getItem("userId"); 

    
        // Update the state with color and createdBy
        setNewCourse((prev) => {
            const updatedCourse = {
                ...prev,
                color: colorName, 
                createdBy: userId 
            };

            return updatedCourse;
        });
    };

    // Validate numeric input
    const handleParInputChange = (index, value) => {
        const regex = /^[0-9]*$/; // Only allows numeric input
        if (regex.test(value) || value === "") {
            const updatedHoles = newCourse.holes.map((hole, i) =>
                i === index ? { ...hole, par: value } : hole // Update the par as string
            );

            const totalPar = updatedHoles.reduce((sum, hole) => sum + (hole.par || 0), 0); // Recalculate total par

            setNewCourse((prev) => ({
                ...prev,
                holes: updatedHoles,
                totalPar, // Update totalPar
            }));
        }
    };

    return (
        <div className="course-container">
            <h1 className="course-title">Add Course</h1>

            {/* Course Name Input */}
         
            <input
                type="text"
                name="courseName"
                className="course-name-input"
                placeholder="course name"
                value={newCourse.courseName}
                onChange={handleInputChange}
                onBlur={() => console.log("Course Name Saved:", newCourse.courseName)}
            />

            {/* Number of Holes Input */}
            <input
                type="text"
                name="numberOfHoles"
                className="holes-input"
                placeholder="number of holes"
                value={newCourse.numberOfHoles || ""}
                onChange={handleInputChange}
                // onBlur={() => //console.log("Number of Holes Saved:", newCourse.numberOfHoles)}
            />


            {/* Hole Details */}
            {newCourse.holes.map((hole, index) => (
                <div key={index} className="hole-par-container">
                    <label className="hole-label">Hole {hole.holeNumber} </label>
                    <input
                        type="text" 
                        value={hole.par || ""}
                        className="par-input"
                        placeholder="par"
                        onBlur={(e) => handleHoleBlur(index, e.target.value)} // Save on blur
                        onChange={(e) => handleParInputChange(index, e.target.value)} // Validate numeric input
                    />
                </div>
            ))}
            
            {/* Color Selection Grid */}
            <ColorGrid onSelectColor={handleSelectColor} />

            <button className="save-course-button"onClick={postCourse}>Save Course</button>
        </div>
    );
}

export default Course;
