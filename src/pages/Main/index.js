import React, {useState, useEffect} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

export default function Main({navigation}) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getusers() {
      const data = await AsyncStorage.getItem('users');
      if (data) setUsers(JSON.parse(data));
    }

    getusers();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleAddUser = async () => {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);

    Keyboard.dismiss();
  };

  const handleNavigate = user => {
    navigation.navigate('User', {user});
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCaptalize="none"
          placeholder="Adicionar Usuário"
          value={newUser}
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={() => handleAddUser()}
        />
        <SubmitButton loading={loading} onPress={() => handleAddUser()}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Icon name="add" size={20} color="#FFF" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>
            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

Main.navigationOptions = {
  title: 'Usuários',
};
