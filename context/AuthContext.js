import React, {useState, useEffect, useRef} from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import errorHandler from "../errors";

const [user, setUser] = useState();

const AuthContext = React.createContext({

});

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_GUEST: "LOGIN_GUEST"
}

function AuthContextProvider(props) {
    const [user, setUser] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    

    useEffect(() => {
        auth.getLoggedIn();
    }, []);


        user.getLoggedIn = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user){
                return user;
            }
        })
    }

        user.registerUser = async (username, email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                const user = userCredentials.user;
                const usersCollectionRef = collection(db, 'users');
                await updateProfile(user, {displayName: username}).catch(
                    (err) => console.log(err)
                );
                
                await setDoc(doc(usersCollectionRef, user.email), {
                    username: username,
                    uid: user.uid,
                    email: user.email,
                });

                // const userCollection = await getDocs(collection(db, "users"));
                // userCollection.forEach((doc) => {
                //     if (doc.data().uid === user.uid) {
                //         console.log(doc.data().username)
                //     }
                // });
                console.log('Registered in with: ', user.email);


            })
            .catch(error => alert(errorHandler(error)));

    }

        user.loginUser = async (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with: ', user.email);
        })
        .catch(error => alert(errorHandler(error)))
    }

        user.logoutUser = async () => {
        signOut(auth)
        .then(() => {
            console.log(`${user?.email} logged out`)
        })
        .catch(error => alert(errorHandler(error)))
    }
}

export default AuthContext;