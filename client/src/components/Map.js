import {useContext, useEffect} from 'react';
import { connect } from 'react-redux';

import {LAYERS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import CanvasContext from './CanvasContext';
import {loadMap} from './slices/statusSlice';

const mapDispatch = { loadMap };

const Map = ({ loadMap }) => {
    const context = useContext(CanvasContext);
    const {COLS, ROWS} = MAP_DIMENSIONS;

    useEffect(() => {
        const drawLayer = grid => {
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    const item = grid[i][j];
                    if (!item) {
                        // empty tile
                        continue;
                    }                
                    const img = document.querySelector(`#map-tile-img-${item}`);
                    const x = j * TILE_SIZE;
                    const y = i * TILE_SIZE;
                    context.canvas.drawImage(
                        img,
                        0,
                        0,
                        TILE_SIZE,
                        TILE_SIZE,
                        x,
                        y,
                        TILE_SIZE,
                        TILE_SIZE,
                    );
                }
            }
        };

        drawLayer(LAYERS[0]);
        drawLayer(LAYERS[1]);
        loadMap(true);
    }, [COLS, ROWS, context, loadMap]);

    return null;
};



export default connect(null, mapDispatch)(Map);
