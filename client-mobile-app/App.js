import 'react-native-gesture-handler'
import { StyleSheet } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import AuthProvider from './context/AuthContext';
import client from './config/apolloClient';
import { ApolloProvider } from '@apollo/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <MainNavigation />
      </AuthProvider>
    </ApolloProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
