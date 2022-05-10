import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Modal, Platform} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

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
    const [url, setUrl] = useState(null);

    useEffect(() => {
        let isActive = true;
        async function loadAvatar(){
            try{
                if(isActive){
                    let rsp = await storage().ref('users').child(user?.uid).getDownloadURL();
                    setUrl(rsp);
                }
                
            }catch{ 
                console.log('Error pegar foto')
            }
        }

        loadAvatar();

        return () => isActive = false;
    }, [])

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
    }

    const uploadFile = ()=> {
        const options = {
            noData: true,
            mediaType: 'photo'
        };

        launchImageLibrary(options, response => {
            if(response.didCancel){
                console.log("cancelou!");
            }else if(response.error){
                console.log("Ops parece que deu algum erro")
            }else{
                uploadFileFirebase(response)
                .then(() => {
                    uploadAvatarPosts();    
                })

                setUrl(response.assets[0].uri)
            }
        })
    }

    const getFilePath = (response) => {
        // Extrair a URL da foto
        return response.assets[0].uri;
    }

    const uploadFileFirebase = async (response) => {
        const fileSource = getFilePath(response);
        //console.log(fileSource)

        const storageRef = storage().ref('users').child(user?.uid);
        
        return await storageRef.putFile(fileSource)
    }
        
    // Percorre todos os posts do usuário e atualiza a foto
    const uploadAvatarPosts = async () => {
        const storageRef = storage().ref('users').child(user?.uid);
        const url = await storageRef.getDownloadURL()
        .then(async (image) => {
            //console.log('Imagem recebida: ', image);
            const postDocs = await firestore().collection('posts')
            .where('userId', '==', user.uid).get();

            // Percorrer e trocar a url da img
            postDocs.forEach(async (doc) => {
                await firestore().collection('posts').doc(doc.id).update({
                    avatarUrl: image
                })
            })
        }).catch((error) => {
            alert(error);
        })
    } 

    return(
        <Container>
            <Header/>

            { url ? (
                <UploadButton onPress = {() => uploadFile()}>
                    <UploadText>+</UploadText>
                    <Avatar 
                        source = {{uri: url}}
                    />
                </UploadButton>
            ): (    
                <UploadButton onPress = {() => uploadFile()}>
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