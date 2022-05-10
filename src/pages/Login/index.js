import React, {useState, useContext} from 'react';
import {View, Text, Keyboard, ActivityIndicator} from 'react-native';
import *  as Animatable from 'react-native-animatable';

const TitleAnimated = Animatable.createAnimatableComponent(Title);

import { 
    Container, 
    Title, 
    Input, 
    Button, 
    ButtonText, 
    SignUpButtom, 
    SignUpText
} from './styles';

import { AuthContext } from '../../contexts/auth';

function Login(){
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const {signUp, signIn, loadingAuth} = useContext(AuthContext);

    function toggleLogin(){
        setLogin(!login);
        setName('');
        setEmail('');
        setPassword('');
        Keyboard.dismiss();
    }

    async function handleSignIn(){
        if(email === '' || password === ''){
            alert('Preencha todos os campos!');
            return;
        }

        console.log('handle', loadingAuth);

        await signIn(email, password);
    }

    async function handleSignUp(){
        if(email === '' || password === '' || name === ''){
            alert('Preencha todos os campos!');
            return;
        }
        console.log('handle',loadingAuth);
        await signUp(email, password, name);
    }

    if(login){
        return(
            <Container>
                <TitleAnimated animation='flipInY'>
                    Dev<Text style = {{color: '#E52246'}}>Post</Text>
                </TitleAnimated>
    
                <Input 
                    placeholder = 'seuemail@exemplo.com'
                    value = {email}
                    onChangeText = {(text) => setEmail(text)}
                />
    
                <Input 
                    placeholder = '*********'
                    value = {password}
                    onChangeText = {(text) => setPassword(text)}
                    secureTextEntry = {true}
                />
    
                <Button onPress = {handleSignIn}>
                    {loadingAuth ? (
                        <ActivityIndicator size={20} color= '#FFF' />
                    ) : (
                        <ButtonText>Acessar</ButtonText>
                    )}
                    
                </Button>
    
                <SignUpButtom onPress = {toggleLogin}>
                    <SignUpText>Criar uma Conta</SignUpText>
                </SignUpButtom>
    
            </Container>
        )
    }else{
        return(
            <Container>
                <TitleAnimated animation='flipInX'>
                    Dev<Text style = {{color: '#E52246'}}>Post</Text>
                </TitleAnimated>
    
                <Input 
                    placeholder = 'Nome'
                    value = {name}
                    onChangeText = {(text) => setName(text)}
                />

                <Input 
                    placeholder = 'seuemail@exemplo.com'
                    value = {email}
                    onChangeText = {(text) => setEmail(text)}
                />
    
                <Input 
                    placeholder = '*********'
                    value = {password}
                    onChangeText = {(text) => setPassword(text)}  
                    secureTextEntry = {true}
                />
    
                <Button onPress = {handleSignUp}>
                {loadingAuth ? (
                        <ActivityIndicator size={20} color= '#FFF' />
                    ) : (
                        <ButtonText>Cadastrar</ButtonText>
                    )}
                </Button>
    
                <SignUpButtom onPress = {toggleLogin}>
                    <SignUpText>Já tenho uma conta</SignUpText>
                </SignUpButtom>
    
            </Container>
        )
            
    }

    
    
}

export default Login;