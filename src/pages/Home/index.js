import React, {useState, useContext, useCallback} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import {Container, ButtonPost, ListPosts} from './styles';
import Header from '../../components/Header';
import {AuthContext} from '../../contexts/auth';
import PostsList from '../../components/PostsList';

function Home(){
    const navigation = useNavigation();
    const {user} = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [lastItem, setLastItem] = useState('');
    const [emptyList, setEmptyList] = useState(false);  

    // Desmonta quando sai dessa tela
    useFocusEffect( 
        useCallback(() => {
            let isActive = true;

            function fetchPosts(){
                firestore().collection('posts')
                .orderBy('created', 'desc')
                .limit(5)
                .get()
                .then((snapshot) => {
                    if(isActive){
                        setPosts([]);
                        const postList = [];

                        snapshot.docs.map( u => {
                            postList.push({
                                ...u.data(), // Pega tudo do post
                                id: u.id,
                            })
                        })

                        setEmptyList(!!snapshot.empty);
                        setPosts(postList);
                        setLastItem(snapshot.docs[snapshot.docs.length-1]);
                        setLoading(false);
                    }
                })
            }

            fetchPosts();

            // Quando desmonta...
            return() => {
                //Não atualizar nenhum estado desse componente quando sair dele
                 isActive = false;
            }

        }, [])
    )

    // Refresh ao puxar lista de posts pra cima
    function handleRefreshPosts(){
        setLoadingRefresh(true);
        firestore().collection('posts')
                .orderBy('created', 'desc')
                .limit(5)
                .get()
                .then((snapshot) => {                   
                    setPosts([]);
                    const postList = [];

                    snapshot.docs.map( u => {
                        postList.push({
                            ...u.data(), // Pega tudo do post
                            id: u.id,
                        })
                    })

                    setEmptyList(false);
                    setPosts(postList);
                    setLastItem(snapshot.docs[snapshot.docs.length-1]);
                    setLoading(false);
                })
                setLoadingRefresh(false);
    }

    // Pegar mais posts ao chegar no fim da lista
    async function getListPosts(){
        if(emptyList){
            // Se ja buscou toda a lista, tiramos o loading
            setLoading(false);
            return null;
        }

        if (loading) return;

        firestore().collection('posts')
        .orderBy('created', 'desc')
        .limit(5)
        .startAfter(lastItem)
        .get()
        .then( (snapshot) => {
            const postList = [];

            snapshot.docs.map( u => {
                postList.push({
                    ...u.data(),
                    id: u.id
                })
            })
            setEmptyList(!!snapshot.empty);
            setLastItem(snapshot.docs[snapshot.docs.length-1]);
            setPosts(oldsPosts => [...oldsPosts, ...postList]);
            setLoading(false);
        })      

    }

    return(
        <Container >
            <Header />

            { loading ? (
                <View style =  {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={50} color='#E52246'/> 
                </View>
            ) : (
                <ListPosts 
                    showVerticalScrollIndicator = {false}
                    data = {posts}
                    renderItem = { ({item}) => (
                        <PostsList 
                            data = {item}
                            userId = {user?.uid}
                        />
                    
                    ) }
                    refreshing={loadingRefresh}
                    onRefresh = {handleRefreshPosts}
                    onEndReached = {() =>getListPosts()}
                    onEndReachedThreshold = {0.1}
                />
            ) }


            <ButtonPost
            activeOpacity = {0.8}
            onPress = { () => navigation.navigate('NewPost') }
            >
                <Feather
                    name='edit-2'
                    color='#FFF'
                    size={25}
                />
            </ButtonPost>
        </Container>
    )
}

export default Home;