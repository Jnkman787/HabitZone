import React from 'react';
import { Animated, Platform } from 'react-native';
import { width } from './utils/Scaling';
import Colors from './utils/Colors';

// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// screens
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';
import CalendarScreen from './screens/CalendarScreen';
import MenuScreen from './screens/MenuScreen';
import AddHabitScreen from './screens/habit/AddHabitScreen';
import CategoryScreen from './screens/habit/CategoryScreen';
import GoalScreen from './screens/habit/GoalScreen';
import FrequencyScreen from './screens/habit/FrequencyScreen';
import HabitDetailsScreen from './screens/habit/HabitDetailsScreen';
import EditHabitScreen from './screens/habit/EditHabitScreen';
import HabitOptionsScreen from './screens/settings/HabitOptionsScreen';
import NotificationsScreen from './screens/settings/NotificationsScreen';
import CustomizeScreen from './screens/settings/CustomizeScreen';
import AboutScreen from './screens/settings/AboutScreen';
import GeneralSettingsScreen from './screens/settings/GeneralSettingsScreen';
import PrivacyPolicyScreen from './screens/settings/PrivacyPolicyScreen';
import TutorialScreen from './screens/settings/TutorialScreen';
import OpeningScreen from './screens/OpeningScreen';

// components
import AddButton from './components/AddButton';

// animation transitions
const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        }),
        next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            })
            : 0
    );
  
    return {
        cardStyle: {
            transform: [
                {
                    translateX: Animated.multiply(
                        progress.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [
                                screen.width, // Focused, but offscreen in the beginning
                                0, // Fully focused
                                screen.width * -0.3, // Fully unfocused
                            ],
                            extrapolate: 'clamp',
                        }),
                        inverted
                    ),
                },
            ],
        },
    };
};

// navigators
const SettingsStackScreens = () => {
    const SettingsStack = createStackNavigator();

    return (
        <SettingsStack.Navigator
            initialRouteName='HabitOptions'
            screenOptions={{
                headerStyle: { backgroundColor: Colors.theme },
                headerTintColor: 'white',
                cardStyleInterpolator: forSlide,
                headerBackTitleVisible: false,
                headerLeftContainerStyle: (Platform.OS === 'ios') ? { left: 12 } : null,
                headerTitleStyle: { fontSize: width > 550 ? 20 : 17 }
            }}
        >
            <SettingsStack.Screen
                name='HabitOptions'
                component={HabitOptionsScreen}
                options={{
                    title: 'Habit options',
                    headerTitleAlign: 'center'
                }}
            />
            <SettingsStack.Screen
                name='Notifications'
                component={NotificationsScreen}
                options={{
                    title: 'Notifications',
                    headerTitleAlign: 'center'
                }}
            />
            <SettingsStack.Screen
                name='Customize'
                component={CustomizeScreen}
                options={{
                    title: 'Customize',
                    headerTitleAlign: 'center'
                }}
            />
            <SettingsStack.Screen
                name='About'
                component={AboutScreen}
                options={{
                    title: 'About',
                    headerTitleAlign: 'center'
                }}
            />
            <SettingsStack.Screen
                name='GeneralSettings'
                component={GeneralSettingsScreen}
                options={{
                    title: 'General settings',
                    headerTitleAlign: 'center'
                }}
            />
            <SettingsStack.Screen
                name='PrivacyPolicy'
                component={PrivacyPolicyScreen}
                options={{
                    title: 'Privacy policy',
                    headerTitleAlign: 'center'
                }}
            />
            <SettingsStack.Screen
                name='Tutorial'
                component={TutorialScreen}
                options={{
                    header: () => null
                }}
            />
        </SettingsStack.Navigator>
    );
};

const DetailsStackScreens = () => {
    const DetailsStack = createStackNavigator();

    return (
        <DetailsStack.Navigator
            initialRouteName='HabitDetails'
            screenOptions={{
                headerStyle: { backgroundColor: Colors.theme },
                headerTintColor: 'white',
                cardStyleInterpolator: forSlide,
                headerBackTitleVisible: false,
                headerLeftContainerStyle: (Platform.OS === 'ios') ? { left: 12 } : null,
                headerTitleStyle: { fontSize: width > 550 ? 20 : 17 }
            }}
        >
            <DetailsStack.Screen
                name='HabitDetails'
                component={HabitDetailsScreen}
                options={HabitDetailsScreen.navigationOptions}
            />
            <DetailsStack.Screen
                name='EditHabit'
                component={EditHabitScreen}
                options={{
                    title: 'Edit habit',
                    headerTitleAlign: 'center'
                }}
            />
        </DetailsStack.Navigator>
    );
};

const HabitStackScreens = () => {
    const HabitStack = createStackNavigator();

    return (
        <HabitStack.Navigator
            initialRouteName='AddHabit'
            screenOptions={{
                headerStyle: { backgroundColor: Colors.theme },
                headerTintColor: 'white',
                cardStyleInterpolator: forSlide,
                headerBackTitleVisible: false,
                headerLeftContainerStyle: Platform.OS === 'ios' ? { left: 12 } : null,
                headerTitleStyle: { fontSize: width > 550 ? 21 : 18 }
            }}
        >
            <HabitStack.Screen
                name='AddHabit'
                component={AddHabitScreen}
                options={{
                    title: 'Create a new habit',
                    headerTitleAlign: 'center'
                }}
            />
            <HabitStack.Screen
                name='Category'
                component={CategoryScreen}
                options={{
                    title: 'Select a category',
                    headerTitleAlign: 'center'
                }}
            />
            <HabitStack.Screen
                name='Goal'
                component={GoalScreen}
                options={GoalScreen.navigationOptions}
                initialParams={{ headerRight: null }}
            />
            <HabitStack.Screen
                name='Frequency'
                component={FrequencyScreen}
                options={FrequencyScreen.navigationOptions}
                initialParams={{ headerRight: null }}
            />
        </HabitStack.Navigator>
    );
};

const TabScreens = () => {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: Colors.theme },
                headerTitleStyle: { fontSize: 22, top: 2 },
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: Colors.theme,
                    borderTopWidth: 1,
                    borderTopColor: Colors.subTheme,
                    height: 56
                }
            }}
        >
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={HomeScreen.navigationOptions}
                initialParams={{ headerLeft: null }}
            />
            <Tab.Screen
                name='List'
                component={ListScreen}
                options={ListScreen.navigationOptions}
                initialParams={{ headerRight: null }}
            />
            <Tab.Screen
                name='Add'
                component={AddButton}
                options={({ navigation }) => ({
                    tabBarButton: () => <AddButton navigation={navigation}/>
                })}
            />
            <Tab.Screen
                name='Calendar'
                component={CalendarScreen}
                options={CalendarScreen.navigationOptions}
                initialParams={{ headerRight: null }}
            />
            <Tab.Screen
                name='Menu'
                component={MenuScreen}
                options={MenuScreen.navigationOptions}
            />
        </Tab.Navigator>
    );
};

const AppContainer = () => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Tab'
            >
                <Stack.Screen
                    name='Tab'
                    component={TabScreens}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='HabitStack'
                    component={HabitStackScreens}
                    options={{
                        headerShown: false,
                        cardStyleInterpolator: forSlide
                    }}
                />
                <Stack.Screen
                    name='DetailsStack'
                    component={DetailsStackScreens}
                    options={{
                        headerShown: false,
                        cardStyleInterpolator: forSlide
                    }}
                />
                <Stack.Screen
                    name='SettingsStack'
                    component={SettingsStackScreens}
                    options={{
                        headerShown: false,
                        cardStyleInterpolator: forSlide
                    }}
                />
                <Stack.Screen
                    name='Opening'
                    component={OpeningScreen}
                    options={{
                        header: () => null,
                        cardStyleInterpolator: forSlide
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppContainer;