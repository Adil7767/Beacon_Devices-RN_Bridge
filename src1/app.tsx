import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Platform,
    StatusBar,
    ScrollView,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    NativeModules,
    useColorScheme,
    TouchableOpacity,
    NativeEventEmitter,
    PermissionsAndroid,
    FlatList,
    Alert,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface PeripheralType {
    id: string;
    name: string;
    rssi: number;
    connected: boolean;
}

const App: React.FC = () => {
    const BleManagerModule = NativeModules.BleManager as any;
    const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    const [connectedDevices, setConnectedDevices] = useState<PeripheralType[]>([]);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scannedDevices, setScannedDevices] = useState<PeripheralType[]>([]);

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    useEffect(() => {
        // turn on bluetooth if it is not on
        BleManager.enableBluetooth().then(() => {
            console.log('Bluetooth is turned on!');
        });

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(result => {
                if (result) {
                    console.log('Permission is OK');
                } else {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ).then(result => {
                        if (result) {
                            console.log('User accept');
                        } else {
                            console.log('User refuse');
                        }
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        let stopListener = BleManagerEmitter.addListener(
            'BleManagerStopScan',
            () => {
                setIsScanning(false);
                console.log('Scan is stopped');
            },
        );

        return () => {
            stopListener.remove();
        };
    }, []);

    const startScan = () => {
        if (!isScanning) {
            BleManager.scan([], 5, true, { scanMode: -1 })
                .then(() => {
                    setIsScanning(true);
                    BleManagerEmitter.addListener(
                        'BleManagerDiscoverPeripheral',
                        peripheral => {
                            //setTimeout(() => {
                            setScannedDevices(devices => [...devices, peripheral]);
                            // }, 5000)
                        },

                    );


                })
                .catch(error => {
                    console.error(error);
                })

        }
    };



    useEffect(() => {
        BleManager.start({ showAlert: false }).then(() => {
            console.log('BleManager initialized');
            handleGetConnectedDevices();
        });
    }, []);



    const handleGetConnectedDevices = () => {
        BleManager.getBondedPeripherals().then(results => {
            if (results.length === 0) {
                console.log('No connected bluetooth devices');
            } else {
                setConnectedDevices(results.map(peripheral => ({
                    ...peripheral,
                    connected: true,
                    name: peripheral.name ?? '11111111',
                })));
            }
        });
    };
    const disconnectFromPeripheral = (peripheral: PeripheralType) => {
        BleManager.removeBond(peripheral.id)
            .then(() => {
                setConnectedDevices(devices =>
                    devices.map(device =>
                        device.id === peripheral.id ? { ...device, connected: false } : device
                    )
                );
                Alert.alert(`Disconnected from ${peripheral.name}`);
            })
            .catch(() => {
                console.log('fail to remove the bond');
            });
    };

    const connectToPeripheral = async (peripheral: PeripheralType) => {
        try {
            const data = await BleManager.createBond(peripheral.id)
            console.log(peripheral, 'data');

            setConnectedDevices(devices =>
                devices.map(device =>
                    device.id === peripheral.id ? { ...device, connected: true } : device
                )
            )
            console.log('BLE device paired successfully');
        }
        catch (e) {
            showMessage({
                message: e,
                type: "warning",
            });

            console.log(e);
        }
    };

    const RenderItem: React.FC<{ peripheral: PeripheralType, index: number }> = ({ peripheral, index }) => {
        console.log('====================================');
        console.log(peripheral);
        console.log('====================================');
        const { name, rssi, connected, id } = peripheral;
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
                        connected ? disconnectFromPeripheral(peripheral) : connectToPeripheral(peripheral)
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
        <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <FlashMessage position="top" />
            <ScrollView
                style={backgroundStyle}
                contentContainerStyle={styles.mainBody}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
                        marginBottom: 40,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 30,
                                textAlign: 'center',
                                color: isDarkMode ? Colors.white : Colors.black,
                            }}
                        >
                            React Native BLE Manager Tutorial
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.buttonStyle}
                        onPress={startScan}
                    >
                        <Text style={styles.buttonTextStyle}>
                            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {scannedDevices.length > 0 ? (
                    <FlatList
                        data={scannedDevices}
                        renderItem={({ item, index }) => <RenderItem peripheral={item} index={index} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                ) : (
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>No scanned devices</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
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
