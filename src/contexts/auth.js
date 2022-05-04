import React, {useState, createContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export const AuthContext = createContext({});

// Gerenciamento de autenticação, cadastro...

function AuthProvider( {children} ){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true); // tela inicial

    useEffect(() => {
        async function loadStorage(){
            const storageUser = await AsyncStorage.getItem('@devApp');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }

        loadStorage();
    }, []);

    async function signUp(email, password, name){
        setLoadingAuth(true);

        await auth().createUserWithEmailAndPassword(email, password)
        .then(async (value) => {
            let uid = value.user.uid;

            await firestore().collection('users')
            .doc(uid).set({
                name: name,
                createdAt: new Date(),

            })
            .then(() => {
                let data = {
                    uid: uid,
                    name: name,
                    email: value.user.email
                }

                setUser(data);
                setLoadingAuth(false);
                storageUser(data);
                alert('Cadastrado com Sucesso!');
            })
        })
        .catch((error) => {
            alert(error);
            setLoadingAuth(false);
        })
    }

    async function signIn(email, password){
        setLoadingAuth(true);
        await auth().signInWithEmailAndPassword(email, password)
        .then(async (value) =>{
            let uid = value.user.uid;

            const userProfile = await firestore().collection('users')
            .doc(uid).get();

            //console.log(userProfile.data().name);
            let data = {
                uid: uid,
                name: userProfile.data().name,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
        })
        .catch((error) => {
            alert(error);
            
            setLoadingAuth(false);
        })
    }

    async function storageUser(data){
        await AsyncStorage.setItem('@devApp', JSON.stringify(data));
    }

    async function signOut(){
        await auth().signOut();
        await AsyncStorage.clear()
        .then( () => {
            setUser(null);
        });
    }

    return(
        <AuthContext.Provider value={{signed: !!user, signUp, signIn, signOut, loadingAuth, loading, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;