import React, { useEffect, useRef, useCallback, useState } from "react";
import Peer from 'simple-peer';

function InitiatedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    // useRef to persist the reference to the peer object without re-rendering
    const peerRef = useRef();

    // useState to manage the state of the other user's stream
    const [othersStream, setOthersStream] = useState();

    // useCallback to memoize the function for setting the video node
    const setVideoNode = useCallback(videoNode => {
        if (videoNode) {
            videoNode.srcObject = othersStream;
        }
    }, [othersStream]);

    // useCallback to memoize the function for creating a peer connection
    const createPeer = useCallback(() => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream,
        });

        peer.on('signal', signal => {
            webrtcSocket.emit('sendOffer', {
                callToUserSocketId: othersSocketId,
                callFromUserSocketId: mySocketId,
                offerSignal: signal
            });
        });

        return peer;
    }, [myStream, mySocketId, othersSocketId, webrtcSocket]);

    // useEffect for handling peer connection and socket events
    useEffect(() => {
        peerRef.current = createPeer();
        webrtcSocket.on("receiveAnswer", payload => {
            console.log("received answer from ", payload.callToUserSocketId, ", answers Received: ", Object.keys(payload.answerSignal));
            if (payload.callToUserSocketId === othersSocketId) {
                peerRef.current.signal(payload.answerSignal);
            }
        });

        peerRef.current.on('stream', stream => {
            setOthersStream(stream);
        });
    }, [createPeer, webrtcSocket, othersSocketId]);

    // Render video element if other user's stream is available
    return (
        <>
            {othersStream && <video width="200px" ref={setVideoNode} autoPlay={true} />}
        </>
    );
}

export default InitiatedVideoCall;









