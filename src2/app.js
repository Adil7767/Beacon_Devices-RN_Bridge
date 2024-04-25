import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, DeviceEventEmitter } from 'react-native';
import Beacons from 'react-native-beacons-manager';
import BluetoothState from 'react-native-bluetooth-state';

export function App() {
    // Initialize state using useState hook
    const [bluetoothState, setBluetoothState] = useState('');
    const [dataSource, setDataSource] = useState([]);

    // Define region information
    const identifier = 'GemTot for iOS';
    const uuid = '6665542b-41a1-5e00-931c-6a82db9b78c1';

    useEffect(() => {
        // Request for authorization while the app is open
        Beacons.requestWhenInUseAuthorization();

        // Define a region
        const region = {
            identifier: identifier,
            uuid: uuid
        };

        // Start ranging beacons in the region
        Beacons.startRangingBeaconsInRegion(region);

        // Listen for beacon changes
        const beaconsDidRange = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            setDataSource(data.beacons);
        });

        // Listen for Bluetooth state change
        BluetoothState.subscribe((state) => {
            setBluetoothState(state);
        });

        // Initialize Bluetooth state
        BluetoothState.initialize();

        // Cleanup effect: remove listeners when the component unmounts
        return () => {
            beaconsDidRange.remove();
            BluetoothState.unsubscribe();
        };
    }, []);

    // Render row function
    const renderRow = ({ item: rowData }) => (
        <View style={styles.row}>
            <Text style={styles.smallText}>
                UUID: {rowData.uuid || 'NA'}
            </Text>
            <Text style={styles.smallText}>
                Major: {rowData.major || 'NA'}
            </Text>
            <Text style={styles.smallText}>
                Minor: {rowData.minor || 'NA'}
            </Text>
            <Text>
                RSSI: {rowData.rssi || 'NA'}
            </Text>
            <Text>
                Proximity: {rowData.proximity || 'NA'}
            </Text>
            <Text>
                Distance: {rowData.accuracy ? `${rowData.accuracy.toFixed(2)}m` : 'NA'}
            </Text>
        </View>
    );

    // Render function
    return (
        <View style={styles.container}>
            <Text style={styles.btleConnectionStatus}>
                Bluetooth connection status: {bluetoothState || 'NA'}
            </Text>
            <Text style={styles.headline}>
                All beacons in the area
            </Text>
            <FlatList
                data={dataSource}
                keyExtractor={(item) => item.uuid}
                renderItem={renderRow}
                enableEmptySections={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    btleConnectionStatus: {
        fontSize: 20,
        paddingTop: 20,
    },
    headline: {
        fontSize: 20,
        paddingTop: 20,
    },
    row: {
        padding: 8,
        paddingBottom: 16,
    },
    smallText: {
        fontSize: 11,
    },
});

