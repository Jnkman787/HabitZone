import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AppContainer from './src/Routes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/store/configureStore';
import LoadingSpinner from './src/components/LoadingSpinner';
import Colors from './src/utils/Colors';
import { MenuProvider } from 'react-native-popup-menu';

const fetchFonts = () => {
  return Font.loadAsync({
    'custom-icons': require('./src/assets/fonts/fontello.ttf'),
    'roboto-medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
    'westmeath': require('./src/assets/fonts/Westmeath-regular.ttf'),
    'sketch': require('./src/assets/fonts/Sketch_Block.ttf')
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        //await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await fetchFonts();
        // Artificially delay for two seconds to simulate a slow loading experience
        //await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setDataLoaded(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dataLoaded) {
      //await SplashScreen.hideAsync();
    }
  }, [dataLoaded]);

  if (!dataLoaded) {
    return (<LoadingSpinner color='#cc5200'/>);
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <PersistGate loading={<LoadingSpinner color='#cc5200'/>} persistor={persistor}>
          <MenuProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.theme }}>
              <StatusBar backgroundColor={Colors.theme}/>
              <AppContainer/>
            </SafeAreaView>
          </MenuProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};