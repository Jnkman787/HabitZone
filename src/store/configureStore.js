import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import settingsReducer from './settingsSlice';
import setupReducer from './setupSlice';
import habitReducer from './habitSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

// I only care about saving the settings & habit reducers in async storage
const habitPersistedReducer = persistReducer(persistConfig, habitReducer);
const settingsPersistedReducer = persistReducer(persistConfig, settingsReducer);

const store = configureStore({
    reducer: {
        settings: settingsPersistedReducer,
        setup: setupReducer,
        habits: habitPersistedReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

const persistor = persistStore(store);
export { store, persistor };