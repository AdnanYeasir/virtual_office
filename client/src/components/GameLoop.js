import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import CanvasContext from './CanvasContext';

import { MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE } from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { checkMapCollision } from './utils';

import { update as updateAllCharactersData } from './slices/allCharactersSlice';
import { firebaseDatabase } from '../firebase/firebase';
import { ref, set, onValue } from "firebase/database";
import FirebaseListener from './FirebaseListener';

// GameLoop component: Manages the game's rendering and state updates
const GameLoop = ({ children, allCharactersData, updateAllCharactersData }) => {
    const canvasRef = useRef(null); // Reference to the canvas element
    const [context, setContext] = useState(null); // State for canvas context and frame count

    useEffect(() => {
        // Sets up the canvas context when the component mounts
        setContext({ canvas: canvasRef.current.getContext('2d'), frameCount: 0 });
    }, [setContext]);

    const loopRef = useRef(); // Reference for the animation frame request
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id]; // Data for the player's character

    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position; // Current position of the player's character
        const key = e.key; // Key pressed by the player
        if (MOVE_DIRECTIONS[key]) {
            // Check if the key corresponds to a valid movement direction
            const [x, y] = MOVE_DIRECTIONS[key]; // Get the movement vector
            var xPos = currentPosition.x + x; // Calculate new x position
            var yPos = currentPosition.y + y; // Calculate new y position

            if (!checkMapCollision(xPos, yPos)) {
                // Check for collision at the new position
                const newPos = {
                    x: xPos,
                    y: yPos
                };

                const posRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id + '/position');

                onValue(posRef, (snapshot) => {
                    // Firebase listener for position updates
                    const updateMyCharacterData = {
                        ...mycharacterData,
                        position: snapshot.val() // Update position from Firebase
                    };
                    const updatedUsersList = {
                        ...allCharactersData
                    };
                    updatedUsersList[MY_CHARACTER_INIT_CONFIG.id] = updateMyCharacterData;
                    updateAllCharactersData(updatedUsersList); // Update the global state
                });

                set(posRef, newPos); // Update the position in Firebase
            }
        }
    }, [mycharacterData]);

    const tick = useCallback(() => {
        // Function to update the frame count for re-rendering
        if (context != null) {
            setContext({ canvas: context.canvas, frameCount: (context.frameCount + 1) % 60 });
        }
        loopRef.current = requestAnimationFrame(tick); // Request the next animation frame
    }, [context]);

    useEffect(() => {
        // Set up the main rendering loop
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current); // Clean up the animation frame request on unmount
        }
    }, [loopRef, tick])

    useEffect(() => {
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                
                ref={canvasRef}
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                class="main-canvas"
            />
            <FirebaseListener/>
            {children}
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return { allCharactersData: state.allCharacters.users };
};

export default connect(mapStateToProps, { updateAllCharactersData })(GameLoop);