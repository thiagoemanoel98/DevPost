import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Container, AreaInput, Input, List} from './styles';

function Search(){
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);

    return(
        <Container>
            <AreaInput>
                <Feather
                    name='search'
                    size={20}
                    color = '#E52246'
                />
                <Input 
                    placeholder = 'Procurando Alguém?'
                    value = {input}
                    onChangeText = { (text) => setInput(text) }
                />

            </AreaInput>
        </Container>
    )
}

export default Search;