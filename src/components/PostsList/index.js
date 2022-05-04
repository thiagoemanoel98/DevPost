import React, {useState} from 'react';
import {
    Container, 
    Name, 
    HeaderPost, 
    ContentView, 
    Content, 
    Avatar,
    Like,
    LikeButton,
    TimePost,
    Actions
} from './styles';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';

function PostsList({data, userId}){
    const navigation = useNavigation();
    const [likePost, setLikePost] = useState(data?.likes);

    function formatDataPost(){
        const datePost = new Date(data.created.seconds * 1000);

        return formatDistance(
            new Date(),
            datePost,
            {locale: ptBR}
        )
    }

    async function handleLikePost(id, likes){
        
        const docId = `${userId}_${id}`;

        // Checar se o post já foi curtido
        const doc = await firestore().collection('likes')
        .doc(docId).get();

        // True -> já curtiu
        if(doc.exists){
            
            await firestore().collection('posts')
            .doc(id).update({
                likes: likes - 1
            })

            await firestore().collection('likes').doc(docId)
            .delete()
            .then(() => {
                setLikePost(likes -1);
            })
            return;
        }
       
        // Precisamos dar o like no post
        await firestore().collection('likes')
        .doc(docId).set({
            postId: id,
            userId: userId,
        });

        await firestore().collection('posts')
        .doc(id).update({
            likes: likes +1
        })
        .then(() => {
            setLikePost(likes+1);
        })
    }

    return(
        <Container>
            <HeaderPost onPress = {() => navigation.navigate('PostsUser', {title: data.author, userId: data.userId})}>
                {data.avatarUrl ? (
                    <Avatar
                        source = {{uri: data.avatarUrl}} 
                    />
                ) : (
                    <Avatar
                        source = {require('../../assets/avatar.png')} 
                    />
                )}
                
                <Name numberOfLines = {1}>
                    {data?.author}
                </Name>
            </HeaderPost>

            <ContentView>
                <Content>{data?.content}</Content>
            </ContentView>

            <Actions>
                <LikeButton onPress = {() => handleLikePost(data.id, likePost)}>
                    <MaterialCommunityIcons 
                        name = {likePost === 0 ? 'heart-plus-outline' : 'cards-heart'}
                        size={20}
                        color='#E52246'
                    />
                    <Like>
                        {likePost === 0 ? '' : likePost}
                    </Like>

                </LikeButton>

                <TimePost>
                    {formatDataPost()}
                </TimePost>
            </Actions>
            
        </Container>
    )
}

export default PostsList