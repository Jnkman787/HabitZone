import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { width } from '../../utils/Scaling';
import Colors from '../../utils/Colors';

const PrivacyPolicyScreen = () => {
    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ width: width > 550 ? '80%' : '90%', alignSelf: 'center' }}>
                        <Text style={styles.categoryText}>Privacy Policy</Text>
                        <Text style={styles.regularText}>
                            All data provided to HabitZone is only stored locally in your device. Your data is not uploaded anywhere. 
                            The developer of HabitZone does not have access to it. Your data is not shared with any 3rd parties. HabitZone does not include any advertisement 
                            libraries or any 3rd party tracking (analytics) code, such as Google Analytics or Facebook SDK.
                        </Text>
                        <Text style={[styles.regularText, { fontWeight: 'bold' }]}>NOTE:</Text>
                        {Platform.OS === 'android'
                            ? <Text style={[styles.regularText, { marginTop: 0 }]}>
                                If you have activated “Backup & Reset” in your phone settings (Settings / Backup & Reset / Back up my data), 
                                you should be aware that Android itself (not HabitZone) will periodically save a copy of your phone's data in Google's servers. This allows Android 
                                to recover your data in case your device gets damaged, or you purchase a new device. The developer of HabitZone does not have access to this data.
                            </Text>
                            : <Text style={[styles.regularText, { marginTop: 0 }]}>
                                It should be noted that the developer of HabitZone does not have access to any data saved by your device that enables you to recover your data in
                                case it gets damaged or you purchase a new device.
                            </Text>
                        }

                        <Text style={[styles.categoryText, { alignSelf: 'baseline', marginTop: 25 }]}>Software License</Text>
                        <Text style={styles.regularText}>Copyright © 2022 Joshua Matte (habitzone.org)</Text>
                        <Text style={styles.regularText}>
                            HabitZone is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, 
                            either version 3 of the License, or (at your option) any later version.
                        </Text>
                        <Text style={styles.regularText}>
                            HabitZone is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
                            See the GNU General Public License for more details.
                        </Text>
                        <Text style={styles.regularText}>
                            You should have received a copy of the GNU General Public License along with this program.
                            If not, see https://www.gnu.org/licenses/.
                        </Text>

                        <View style={{ height: 50 }}/>
                    </View>
                </View>

                <View style={{ height: width > 550 ? 110 : 90, backgroundColor: Colors.theme, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.regularText, { color: 'white' }]}>Copyright © 2022, Joshua Matte. </Text>
                    <Text style={[styles.regularText, { color: 'white', marginTop: 0 }]}>All Rights Reserved.</Text>
                </View>
                <View style={{ height: 20 }}/>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    categoryText: {
        fontSize: width > 550 ? 30 : 27,
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 15
    },
    regularText: {
        fontSize: width > 550 ? 20 : 18,
        marginTop: 15
    }
});

export default PrivacyPolicyScreen;