import React, {useContext, useState} from 'react';
import {View, Text, Modal, Platform} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../../contexts/auth';
import Header from '../../components/Header';

import {
    Container,
    Name,
    Email, 
    Button,
    ButtonText,
    UploadButton,
    UploadText,
    Avatar,
    ModalContainer,
    ButtonBack,
    Input
} from './styles';

import Feather from 'react-native-vector-icons/Feather';

function Profile(){
    const {signOut, user, setUser, storageUser} = useContext(AuthContext);

    const [name, setName] = useState(user?.name);
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('https://sujeitoprogramador.com/steve.png');

    async function handleSignOut(){
        await signOut();
    }

    async function updateProfile(){
        if(name === ''){
            return;
        }

        await firestore().collection('users')
        .doc(user?.uid)
        .update({
            name: name
        });

        // Buscar todos os posts desse user e atualizar o seu nome
        const postDocs = await firestore().collection('posts')
        .where('userId', '==', user?.uid).get();

        // Percorrer todos os posts desse user e atualizar
        postDocs.forEach(async doc => {
            await firestore().collection('posts').doc(doc.id)
            .update({
                author: name
            })
        });

        let data = {
            uid: user.uid,
            name: name,
            email: user.email
        }

        setUser(data);
        storageUser(data);
        setOpen(false);

    }

    return(
        <Container>
            <Header/>

            { url ? (
                <UploadButton onPress = {() => alert('CLICOU1')}>
                    <UploadText>+</UploadText>
                    <Avatar 
                        source = {{uri: url}}
                    />
                </UploadButton>
            ): (    
                <UploadButton>
                    <UploadText>+</UploadText>
                    <Avatar 
                        source = {{uri: url}}
                    />
                </UploadButton>
            )}

            <Name>{user?.name}</Name>
            <Email>{user?.email}</Email>

            <Button bg = "#428cfd" onPress={() => setOpen(true)}>
                <ButtonText color = "#FFF">Atualizar Perfil</ButtonText>
            </Button>

            <Button bg = "#ddd" onPress = {handleSignOut}>
                <ButtonText color = "#353840">Sair</ButtonText>
            </Button>

            <Modal visible = {open} animationType = 'slide' transparent = {true} >
                <ModalContainer behavior = {Platform.OS === 'android' ? '' : 'padding'}>
                    <ButtonBack onPress = {() => setOpen(false)}>
                        <Feather 
                            name='arrow-left'
                            size={25}
                            color = '#121212'
                        />
                        <ButtonText color = '#121212'>
                            Voltar
                        </ButtonText>
                    </ButtonBack>

                    <Input
                        placeholder = {user?.name}
                        onChangeText = {(text) => setName(text)}
                    />

                    <Button bg = "#428cfd" onPress = {updateProfile}>
                        <ButtonText color = "#FFF">Salvar</ButtonText>
                    </Button>

                </ModalContainer>
            </Modal>
        </Container>
    )
}

export default Profile;