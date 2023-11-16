import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import CanvasContext from './CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP, MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { TILE_SIZE } from './mapConstants';
import { loadCharacter } from './slices/statusSlice';
import { update as updateAllCharactersData } from './slices/allCharactersSlice';
import { firebaseDatabase } from '../firebase/firebase';
import { ref, set, remove } from "firebase/database";

function MyCharacter({ myCharactersData, loadCharacter, webrtcSocket }) {
    // Accessing the Canvas context
    const context = useContext(CanvasContext);

    // useEffect hook for initializing character data and cleanup
    useEffect(() => {
        // Initializing character data in Firebase
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };
        set(ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id), myInitData);

        // Cleanup function to remove character data from Firebase
        return () => {
            const myCharacterRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id);
            remove(myCharacterRef)
                .then(() => console.log("MyCharacter remove succeeded."))
                .catch(error => console.log("MyCharacter remove failed: " + error.message));
        }
    }, [webrtcSocket]);

    // useEffect hook for drawing the character on the canvas
    useEffect(() => {
        if (!context || !myCharactersData) {
            return;
        }
        // Drawing the character sprite
        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            myCharactersData.position.x * TILE_SIZE,
            myCharactersData.position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, myCharactersData?.position.x, myCharactersData?.position.y, loadCharacter]);

    // Component does not render anything
    return null;
}

// mapStateToProps for Redux connect
const mapStateToProps = (state) => {
    return { myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id] };
};

// mapDispatchToProps for Redux connect
const mapDispatch = { loadCharacter };

export default connect(mapStateToProps, mapDispatch)(MyCharacter);



