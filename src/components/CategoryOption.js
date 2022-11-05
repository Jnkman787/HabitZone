import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width, scale, verticalScale } from '../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';

import { setCategory } from '../store/setupSlice';

// icons
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomIcon from '../utils/CustomIcon';

const getCategoryIcon = (category) => {
    let icon;

    if (category === 'Sports') {
        icon = <Ionicons name='basketball-outline' size={36} color='white'/>
    } else if (category === 'Study') {
        icon = <Ionicons name='school-outline' size={34} color='white'/>
    } else if (category === 'Work') {
        icon = <Feather name='briefcase' size={31} color='white'/>
    } else if (category === 'Nutrition') {
        icon = <Ionicons name='nutrition-outline' size={35} color='white'/>
    } else if (category === 'Home') {
        icon = <Ionicons name='home-outline' size={32} color='white'/>
    } else if (category === 'Outdoor') {
        icon = <Entypo name='tree' size={30} color='white' /> 
    } else if (category === 'Social') {
        icon = <MaterialCommunityIcons name='message-text-outline' size={34} color='white'/>
    } else if (category === 'Art') {
        icon = <Ionicons name='color-palette-outline' size={36} color='white'/>
    } else if (category === 'Finance') {
        icon = <CustomIcon name='coin' size={31} color='white'/>
    } else if (category === 'Other') {
        icon = <Entypo name='dots-three-horizontal' size={33} color='white'/>
        //icon = <MaterialCommunityIcons name='dots-horizontal-circle-outline' size={37} color='white'/>
    } else if (category === 'Travel') {
        icon = <Ionicons name='airplane-outline' size={32} color='white'/>
    } else if (category === 'Health') {
        icon = <MaterialCommunityIcons name='gamepad-round-outline' size={35} color='white'/>
    } else if (category === 'Leisure') {
        icon = <Ionicons name='happy-outline' size={34} color='white'/>
    } else if (category === 'Pets') {
        icon = <Ionicons name='paw-outline' size={32} color='white'/>
    }

    return icon;
};

const CategoryOption = ({ navigation, category, containerStyle, side }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

    const selectColor = (color) => {
        setModalVisible(false);
        dispatch(setCategory({category, color}));
        navigation.goBack();
    };

    const CategoryTouchable = () => {
        if (category === 'Quit') {
            return (
                <TouchableOpacity
                    style={[styles.touchableContainer, { justifyContent: 'center' }]}
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >
                    <MaterialIcons name='do-not-disturb' size={35} color='white'/>
                    <Text style={[styles.categoryText, { marginLeft: 15 }]}>Quit bad habit</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.touchableContainer}
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >
                    <View style={styles.categoryIcon}>
                        {getCategoryIcon(category)}
                    </View>
                    <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={[styles.categoryContainer, containerStyle, {
            backgroundColor: modalVisible ? accentColor : Colors.subTheme,
            marginLeft: side === 'left' ? width > 550 ? '12.5%' : '5%' : 9,
            marginRight: side === 'right' ? width > 550 ? '12.5%' : '5%' : 9
        }]}>
            {CategoryTouchable()}

            <Modal
                isVisible={modalVisible}
                //onRequestClose={() => setModalVisible(false)}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Category color</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <AntDesign name='close' size={29} color='white'/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.border}/>

                    <View style={styles.colorRowContainer}>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#da2d2d' }]} onPress={() => selectColor('#da2d2d')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#2b67d5' }]} onPress={() => selectColor('#2b67d5')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#3c843a' }]} onPress={() => selectColor('#3c843a')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#ffa000' }]} onPress={() => selectColor('#ffa000')}/>
                    </View>

                    <View style={styles.colorRowContainer}>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#de647e' }]} onPress={() => selectColor('#de647e')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#2995a3' }]} onPress={() => selectColor('#2995a3')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#98bb2d' }]} onPress={() => selectColor('#98bb2d')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#c2a756' }]} onPress={() => selectColor('#c2a756')}/>
                    </View>

                    <View style={styles.colorRowContainer}>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#b3002d' }]} onPress={() => selectColor('#b3002d')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#6152c7' }]} onPress={() => selectColor('#6152c7')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#199a69' }]} onPress={() => selectColor('#199a69')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#e65c00' }]} onPress={() => selectColor('#e65c00')}/>
                    </View>

                    <View style={styles.colorRowContainer}>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#f86a55' }]} onPress={() => selectColor('#f86a55')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#ad42ba' }]} onPress={() => selectColor('#ad42ba')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#4f506f' }]} onPress={() => selectColor('#4f506f')}/>
                        <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#c79985' }]} onPress={() => selectColor('#c79985')}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        flex: 1,
        height: width > 550 ? 80 : 70,
        borderRadius: 15,
        marginTop: width > 550 ? 35 : 20
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    categoryIcon: {
        alignItems: 'center',
        width: '45%'
    },
    categoryText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        height: width > 550 ? 400 : 373,
        width: width > 550 ? '70%' : '90%',
        alignSelf: 'center'
    },
    headerLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: width > 550 ? verticalScale(15): 15,
        marginHorizontal: width > 550 ? scale(17) : 17
    },
    headerText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 20,
        fontFamily: 'roboto-medium'
    },
    border: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        width: '100%'
    },
    colorRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    colorOption: {
        height: width > 550 ? 55 : 50,
        width: width > 550 ? 55 : 50,
        borderRadius: width > 550 ? 30 : 25
    }
});

export default CategoryOption;