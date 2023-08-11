import { Text, StatusBar } from 'react-native';
import { NativeBaseProvider } from "native-base";

import { Routes } from '@routes/index';

import { THEME } from './src/theme';

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })
  
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />

      {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>

    
  );
}