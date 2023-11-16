import React, { useEffect, useContext } from 'react';
import CanvasContext from './CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP } from './characterConstants';
import { TILE_SIZE } from './mapConstants';

function OtherCharacter({ name, x, y, characterClass }) {
    // Accessing the Canvas context
    const context = useContext(CanvasContext);

    // Function to draw the character
    const drawCharacter = () => {
        const characterImg = document.querySelector(`#character-sprite-img-${characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            x * TILE_SIZE,
            y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
    };

    // useEffect hook to handle drawing logic
    useEffect(() => {
        if (context) {
            drawCharacter();
        }
    }, [context, x, y, characterClass]); // Dependencies for the useEffect hook

    // Component does not render anything to the DOM
    return null;
}

export default OtherCharacter;





