import React from 'react';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';

export default function User({navigation}) {
  const repository = navigation.getParam('repository');

  return <WebView source={{uri: repository.html_url}} style={{flex: 1}} />;
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

User.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('repository').name,
});
