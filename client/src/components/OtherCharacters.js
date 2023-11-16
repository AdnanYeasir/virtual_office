import React from "react";
import OtherCharacter from './OtherCharacter';
import { connect } from "react-redux";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";

function OtherCharacters({ otherCharactersData }) {
    // console.log("OtherCharacters");
    return <>{
        Object.keys(otherCharactersData).map((id) => (
            // console.log("OtherCharacters: List", id, " position: ", otherCharactersData[id]['position']['x'], ", ", otherCharactersData[id]['position']['y']);
            <OtherCharacter key={id} 
            name={otherCharactersData[id]['username']} 
            x={otherCharactersData[id]['position']['x']}
            y={otherCharactersData[id]['position']['y']}
            characterClass={otherCharactersData[id]['characterClass']}/>
            
        ))
    }  </>
}

const mapStateToProps = (state) => {
    const otherCharactersData = Object.keys(state.allCharacters.users)
        .filter(id => id != MY_CHARACTER_INIT_CONFIG.id)
        .reduce((filteredObj, key) => {
            filteredObj[key] = state.allCharacters.users[key];
            return filteredObj;
        }, {});
    return {otherCharactersData: otherCharactersData};
};

export default connect(mapStateToProps, {}) (OtherCharacters);