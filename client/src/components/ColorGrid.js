import React, { useState } from "react";
import colors from "../utils/colors";
import "../style/ColorGrid.css";

const ColorGrid = ({ onSelectColor }) => {
    const [selectedColor, setSelectedColor] = useState("");

    const handleColorClick = (colorName) => {
        setSelectedColor(colorName);    
        onSelectColor(colorName); 

    };

    return (
        <div className="color-grid">
            {Object.entries(colors).map(([colorName, shades]) => (
                <div 
                    key={colorName} 
                    className="color-swatch" 
                    onClick={() => handleColorClick(colorName)}
                    style={{
                        boxShadow: selectedColor === colorName ? `0 0 10px ${shades.dark}` : 'none',
                    }}>
                    <div
                        className="color-half color-light"
                        style={{ backgroundColor: shades.light }}
                    />
                    <div
                        className="color-half color-dark"
                        style={{ backgroundColor: shades.dark }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ColorGrid;
