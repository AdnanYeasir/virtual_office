import React, { useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { firebaseDatabase } from '../firebase/firebase';
import { connect } from 'react-redux';
import { update as updateAllCharactersData } from './slices/allCharactersSlice'; //may check spelling

const FirebaseListener = ({ updateAllCharactersData }) => {
    useEffect(() => {
        const usersRef = ref(firebaseDatabase, 'users/'); //myuserid/position
        const unsubscribeUsersListener = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            console.log("FirebaseListener data: ", data)
            updateAllCharactersData(data);
        });
        return unsubscribeUsersListener;
    }, []);
    return <></>;
}

export default connect(null, { updateAllCharactersData })(FirebaseListener);