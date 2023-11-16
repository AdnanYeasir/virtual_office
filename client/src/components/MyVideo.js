import React, { useCallback } from "react";

function MyVideo({ myStream }) {
    // useCallback hook to memoize the setVideoNode function. 
    // This function sets the video stream source if the video node and myStream are available.
    const setVideoNode = useCallback(videoNode => {
        if (videoNode) {
            videoNode.srcObject = myStream;
        }
    }, [myStream]); // Dependency array includes myStream, so the function updates when myStream changes.

    // Rendering the video element if myStream is available.
    // The video element references the setVideoNode function to set up its source object.
    return (
        <>
            {myStream && <video width="200px" ref={setVideoNode} autoPlay={true} />}
        </>
    );
}

export default MyVideo;




