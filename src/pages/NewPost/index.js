import React, {useState, useLayoutEffect, useContext} from 'react';
import {View, Text} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AuthContext } from '../../contexts/auth'

import {Container, Input, Button, ButtonText} from './styles';

function NewPost(){
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const[post, setPost] = useState('');

    // Não é assincrono, só renderiza quando ele é executado
    // Não usar para requesições http
    useLayoutEffect(() => {

        const options = navigation.setOptions({
            headerRight: () => (
                <Button onPress = {() => handlePost()}>
                    <ButtonText>Compartilhar</ButtonText>
                </Button>
            )  
        })

    }, [navigation, post]);

    async function handlePost(){
        if(post === ''){
            alert('Seu post contem conteudo invalido.');
            return;
        }

        let avatarUrl = null;

        try{
            let response = await storage().ref('users').child(user?.uid).getDownloadURL();
            avatarUrl = response;
        }catch(err){
            avatarUrl= null;
        }

        // .add() gera um id aleatorio
        await firestore().collection('posts')
        .add({
            created: new Date(),
            content: post,
            author: user?.name,
            userId: user?.uid,
            likes: 0,
            avatarUrl,
        })
        .then( () => {
            setPost('');
            alert('Post criado com sucesso!');
        })
        .catch((error) => {
            alert(error);
        });

        navigation.goBack();
    }

    return(
        <Container>
            <Input 
                placeholder = 'O que está acontecendo?'
                value = {post}
                onChangeText = { (text) => setPost(text) }
                autoCorrent = {false}
                multiline = {true}
                placeholderTextColor = "#DDD"
                maxLength = {300}
            />
        </Container>
    )
}

export default NewPost;