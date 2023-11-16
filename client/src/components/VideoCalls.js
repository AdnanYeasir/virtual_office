import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MyVideo from './MyVideo';
import InitiatedVideoCall from './InitiatedVideoCall';
import ReceivedVideoCall from "./ReceivedVideoCall";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";

function VideoCalls({ myCharacterData, otherCharactersData, webrtcSocket }) {
    const [myStream, setMyStream] = useState();
    const [offersReceived, setOffersReceived] = useState({}); // key -> socketId, value -> offer

    // Getting user media
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setMyStream(stream);
            });
    }, []);

    // Handling received offers
    useEffect(() => {
        webrtcSocket.on("receiveOffer", payload => {
            if (!Object.keys(offersReceived).includes(payload.callFromUserSocketId)) {
                setOffersReceived({
                    ...offersReceived,
                    [payload.callFromUserSocketId]: payload.offerSignal,
                });
            }
        });
    }, [webrtcSocket, offersReceived]);

    const myUserId = myCharacterData?.id;

    // Filtering out other characters for initiating calls
    const initiateCallToUsers = Object.keys(otherCharactersData)
        .filter(othersUserId => othersUserId !== myUserId)
        .reduce((filteredObj, key) => {
            filteredObj[key] = otherCharactersData[key];
            return filteredObj;
        }, {});

    return (
        <>
            {myCharacterData && (
                <div className="videos">
                    <MyVideo myStream={myStream} />
                    {Object.keys(initiateCallToUsers).map(othersUserId => (
                        <InitiatedVideoCall
                            key={initiateCallToUsers[othersUserId].socketId}
                            mySocketId={myCharacterData.socketId}
                            myStream={myStream}
                            othersSocketId={initiateCallToUsers[othersUserId].socketId}
                            webrtcSocket={webrtcSocket}
                        />
                    ))}
                    {Object.keys(offersReceived).map(othersSocketId => (
                        <ReceivedVideoCall
                            key={othersSocketId}
                            mySocketId={myCharacterData.socketId}
                            myStream={myStream}
                            othersSocketId={othersSocketId}
                            webrtcSocket={webrtcSocket}
                            offerSignal={offersReceived[othersSocketId]}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

// mapStateToProps for connecting Redux store
const mapStateToProps = (state) => {
    const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
    const otherCharactersData = Object.keys(state.allCharacters.users)
        .filter(id => id !== MY_CHARACTER_INIT_CONFIG.id)
        .reduce((filteredObj, key) => {
            filteredObj[key] = state.allCharacters.users[key];
            return filteredObj;
        }, {});
    return { myCharacterData, otherCharactersData };
}

export default connect(mapStateToProps)(VideoCalls);






