import React, {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default function User({navigation}) {
  const user = navigation.getParam('user');
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);

  async function getUserData() {
    setLoading(true);
    const response = await api.get(`/users/${user.login}/starred`);
    setStars(response.data);
    setPage(2);
    setLoading(false);
  }

  useEffect(() => {
    getUserData();
  }, []);

  async function loadMore() {
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    if (response.data.length) {
      setStars([...stars, ...response.data]);
      setPage(page + 1);
    }
  }

  const handleNavigate = repository => {
    navigation.navigate('RepoWebView', {repository});
  };

  return (
    <Container>
      <Header>
        <Avatar source={{uri: user.avatar}} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {loading ? (
        <Loading>
          <ActivityIndicator size="large" color="#000" />
        </Loading>
      ) : (
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
          onEndReached={loadMore} // Função que carrega mais itens
          onRefresh={getUserData} // Função dispara quando o usuário arrasta a lista pra baixo
          refreshing={loading} // Variável que armazena um estado true/false que representa se a lista está atualizando
          renderItem={({item}) => (
            <Starred onPress={() => handleNavigate(item)}>
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

User.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('user').name,
});
