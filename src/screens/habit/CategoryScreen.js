import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { width } from '../../utils/Scaling';
import Colors from '../../utils/Colors';

import CategoryOption from '../../components/CategoryOption';

const CategoryScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.screen}>
            <CategoryOption navigation={navigation} category='Quit' containerStyle={{ width: width > 550 ? '75%' : '90%', alignSelf: 'center', flex: 0 }}/>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Sports' side='left'/>
                <CategoryOption navigation={navigation} category='Study' side='right'/>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Work' side='left'/>
                <CategoryOption navigation={navigation} category='Nutrition' side='right'/>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Home' side='left'/>
                <CategoryOption navigation={navigation} category='Outdoor' side='right'/>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Social' side='left'/>
                <CategoryOption navigation={navigation} category='Art' side='right'/>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Finance' side='left'/>
                <CategoryOption navigation={navigation} category='Travel' side='right'/>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Health' side='left'/>
                <CategoryOption navigation={navigation} category='Leisure' side='right'/>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <CategoryOption navigation={navigation} category='Pets' side='left'/>
                <CategoryOption navigation={navigation} category='Other' side='right'/>
            </View>

            <View style={{ height: 25 }}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    }
});

export default CategoryScreen;