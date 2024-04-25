import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Device, UUID } from 'react-native-ble-plx';
import Toast from 'react-native-toast-message';
import { BLEService } from './BLEService';
interface PeripheralType {
    id: string;
    name: string;
    rssi: number;
    // connected: boolean;
}
const App: React.FC = () => {
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState();
    const [scanning, setScanning] = useState(false);

    // Initialize Bluetooth when the component mounts
    useEffect(() => {
        const initializeBluetooth = async () => {
            try {
                await BLEService.initializeBLE();
                Toast.show({
                    type: 'success',
                    text1: 'Bluetooth initialized',
                });
            } catch (error) {
                console.error('Failed to initialize Bluetooth:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to initialize Bluetooth',
                });
            }
        };

        initializeBluetooth();

        // Clean up on component unmount
        return () => {
            if (connectedDevice) {
                BLEService.disconnectDevice();
            }
        };
    }, [connectedDevice]);

    // Scan for BLE devices
    const startScan = async () => {
        setScanning(true);
        setDevices([]);
        try {
            BLEService.scanDevices(device => {
                console.log('================devices====================');
                console.log(device);
                console.log('===============devices=====================');
                setDevices(prevDevices => [...prevDevices, device]);
            });
        } catch (error) {
            console.error('Failed to scan devices:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to scan devices',
            });
            setScanning(false);
        }
    };

    // Stop scanning for BLE devices
    const stopScan = () => {
        setScanning(false);
        BLEService.manager.stopDeviceScan();
    };

    setTimeout(() => {
        stopScan()
    }, 5000);

    // Connect to a selected BLE device
    const connectToDevice = async (deviceId: string) => {
        try {
            const device: any = await BLEService.connectToDevice(deviceId);
            setConnectedDevice(device);
            Toast.show({
                type: 'success',
                text1: 'Connected to device',
            });
            console.log(' connect to device: success',);

        } catch (error) {
            console.log('Failed to connect to device:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to connect to device',
            });
        }
    };

    // Disconnect from the connected BLE device
    const disconnectFromDevice = async (id: string) => {
        try {
            await BLEService.disconnectDeviceById(id);
            setConnectedDevice(null);
            Toast.show({
                type: 'success',
                text1: 'Disconnected from device',
            });
        } catch (error) {
            console.error('Failed to disconnect from device:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to disconnect from device',
            });
        }
    };

    const RenderItem: React.FC<{ peripheral: PeripheralType, index: number }> = ({ peripheral, index }) => {
        console.log('====================================');
        console.log(peripheral);
        console.log('====================================');
        const { name, rssi, id } = peripheral;
        // const connected = BLEService.isDeviceWithIdConnected(id);

        const connected = peripheral.id === connectedDevice
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                }}
            >
                <View style={styles.deviceItem}>
                    <Text style={styles.deviceName}>{id}</Text>
                    <Text style={styles.deviceName}>{name || index + 1}</Text>
                    <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        connected ? disconnectFromDevice(peripheral.id) : connectToDevice(peripheral.id)
                    }}
                    style={styles.deviceButton}
                >
                    <Text style={styles.scanButtonText}>
                        {connected ? 'Disconnect' : 'Connect'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>BLE Device Scanner</Text>
            {scanning ? (
                <Button title="Stop Scan" onPress={stopScan} />
            ) : (
                <Button title="Start Scan" onPress={startScan} />
            )}

            {devices.length > 0 ? (
                <FlatList
                    data={devices}
                    renderItem={({ item, index }) => <RenderItem peripheral={item} index={index} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text style={{ textAlign: 'center', fontSize: 16 }}>No scanned devices</Text>
            )}

            {/* {connectedDevice && (
                <View style={styles.connectedDevice}>
                    <Text>Connected to: {connectedDevice.name || connectedDevice.id}</Text>
                    <Button title="Disconnect" onPress={disconnectFromDevice} />
                </View>
            )} */}
            {connectedDevice?.length > 0 ? (
                <FlatList
                    data={connectedDevice}
                    renderItem={({ item, index }) => <RenderItem peripheral={item} index={index} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text style={{ textAlign: 'center', fontSize: 16 }}>No scanned devices</Text>
            )}

            <Toast />
        </View>
    );
};
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    deviceItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    connectedDevice: {
        marginTop: 20,
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        height: windowHeight,
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderRadius: 30,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceItem: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 20,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold'

    },
    deviceInfo: {
        fontSize: 14,
        color: 'gray',
    },
    deviceButton: {
        backgroundColor: '#307ecc',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 10,
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default App;
