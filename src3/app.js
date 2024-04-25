// import React, { useState } from 'react';
// import { Image, NativeModules, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// const { VoiceChangingModule } = NativeModules;

// const App = () => {
//     // const audioTrackURL = 'https://file-examples.com/storage/feeb836c2d66294eb99ac59/2017/11/file_example_MP3_700KB.mp3';
//     const audioTrackURL = '../assets/voice.mp3';
//     const [pitch, setPitch] = useState('');
//     const [speed, setSpeed] = useState('');
//     const [effectType, setEffectType] = useState('');

//     const changeVoiceEffect = (pitch, speed, effectType) => {
//         VoiceChangingModule.changeVoiceEffect({ audioTrackURL, pitch, speed, effectType })
//             .then(response => {
//                 console.log(response); // Voice changed successfully
//             })
//             .catch(error => {
//                 console.error(error); // Handle error
//             });
//     };


//     ;

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor={'#e4e5ea'} />
//             <Text style={styles.title}>Voice Changer</Text>
//             <Text style={styles.title}> Change Voice Effects </Text>
//             <View style={styles.iconsContainer}>
//                 <TouchableOpacity onPress={() => changeVoiceEffect(0.6, 1.0, 'alien')}>
//                     <Image
//                         source={require('../assets/alien.png')}
//                         resizeMode={'contain'}
//                         style={styles.icon}
//                     />
//                     <Text>Alien</Text>
//                 </TouchableOpacity>
// <TouchableOpacity onPress={() => changeVoiceEffect(1.8, 1.0, 'child')}>
//     <Image
//         source={require('../assets/child.png')}
//         resizeMode={'contain'}
//         style={styles.icon}
//     />
//     <Text>Child</Text>
// </TouchableOpacity>
// <TouchableOpacity onPress={() => changeVoiceEffect(1.0, 2.5, 'fast')}>
//     <Image
//         source={require('../assets/fast.png')}
//         resizeMode={'contain'}
//         style={styles.icon}
//     />
//     <Text>Fast</Text>
// </TouchableOpacity>
// <TouchableOpacity onPress={() => changeVoiceEffect(1.0, 0.4, 'slow')}>
//     <Image
//         source={require('../assets/back.png')}
//         resizeMode={'contain'}
//         style={styles.icon}
//     />
//     <Text>Slow</Text>
// </TouchableOpacity>
//             </View>
//             <Text style={styles.title}>Voice Changer</Text>
//             <Text style={styles.title}> Change Voice Effects </Text>
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Pitch"
//                     onChangeText={text => setPitch(text)}
//                     value={pitch}
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Speed"
//                     onChangeText={text => setSpeed(text)}
//                     value={speed}
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Effect Type"
//                     onChangeText={text => setEffectType(text)}
//                     value={effectType}
//                 />
//             </View>
//             <View style={styles.iconsContainer}>
//                 <TouchableOpacity onPress={() => changeVoiceEffect()}>
//                     <Text>Change Voice Effect</Text>
//                 </TouchableOpacity>
//             </View>
//         </ScrollView>
//     );
// };


// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#e4e5ea',
//         flex: 1,
//         paddingTop: 50,
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         color: '#000',
//         marginVertical: 25,
//     },
//     iconsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-evenly',
//         width: '100%',
//         paddingHorizontal: 50,
//     },
//     warningText: {
//         color: 'red',
//         fontWeight: 'bold',
//         letterSpacing: 1.5,
//         textAlign: 'center',
//     },
//     spacing: {
//         marginVertical: 10,
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '40%',
//     },
//     icon: {
//         height: 40,
//         width: 40,
//         marginBottom: 15,
//     },
//     currentEffect: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginVertical: 10,
//     },
//     container: {
//         backgroundColor: '#e4e5ea',
//         flex: 1,
//         paddingTop: 50,
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         color: '#000',
//         marginVertical: 25,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-evenly',
//         width: '100%',
//         marginBottom: 20,
//     },
//     input: {
//         height: 40,
//         width: 100,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         paddingHorizontal: 10,
//         marginBottom: 10,
//     },
//     iconsContainer: {
//         alignItems: 'center',
//     },
//     currentEffect: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginVertical: 10,
//     },
// });

// export default App;

import React, { useState } from 'react';
import { Image, NativeModules, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const { VoiceChangingModule } = NativeModules;

const App = () => {
    const [pitch, setPitch] = useState();
    const [speed, setSpeed] = useState();
    const [effectType, setEffectType] = useState('');
    const audioTrackURL = 'https://file-examples.com/storage/feeb836c2d66294eb99ac59/2017/11/file_example_MP3_700KB.mp3';
    const changeVoiceEffect = async (pitch, speed, effectType) => {
        try {
            console.log('====================================');
            console.log(audioTrackURL, pitch, speed, effectType);
            console.log('====================================');

            const res = await VoiceChangingModule.changeVoice({ audioTrackURL, pitch, speed, effectType })

            // const res = await VoiceChangingModule.changeVoiceEffect({ audioTrackURL, pitch, speed, effectType })

            console.log(res); // Voice changed successfully

        }
        catch (error) {
            console.error(error);
        };
    };
    const onSubmit = () => {
        try {
            const pitch1 = parseInt(pitch)
            const speed1 = parseInt(speed)
            changeVoiceEffect(pitch1, speed1, effectType)
        }
        catch (error) {
            console.error(error);
        }
    }
    const arr = ['Pitch', 'Speed', 'Type Name']
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={'#e4e5ea'} />
            <Text style={styles.title}>Voice Changer</Text>
            <Text style={styles.title}> Change Voice Effects </Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => changeVoiceEffect(0.6, 1.0, 'alien')}>
                    <Image
                        source={require('../assets/alien.png')}
                        resizeMode={'contain'}
                        style={styles.icon}
                    />
                    <Text>Alien</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeVoiceEffect(1.8, 1.0, 'child')}>
                    <Image
                        source={require('../assets/child.png')}
                        resizeMode={'contain'}
                        style={styles.icon}
                    />
                    <Text>Child</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeVoiceEffect(1.0, 2.5, 'fast')}>
                    <Image
                        source={require('../assets/fast.png')}
                        resizeMode={'contain'}
                        style={styles.icon}
                    />
                    <Text>Fast</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeVoiceEffect(1.0, 0.4, 'slow')}>
                    <Image
                        source={require('../assets/back.png')}
                        resizeMode={'contain'}
                        style={styles.icon}
                    />
                    <Text>Slow</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Customize Voice Effect</Text>
            <View style={styles.inputContainer} >
                {arr.map((item, index) => {
                    return (
                        <View style={{ flexDirection: 'column' }} key={index}>
                            <Text >{item}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={item}
                                onChangeText={text => setPitch(text)}
                                value={pitch}
                            />
                        </View>
                    )
                })}
            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.btn} onPress={onSubmit}>
                    <Text style={styles.btnText}>Change Voice Effect</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e4e5ea',
        flex: 1,
        paddingTop: 50,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: '#000',
        marginVertical: 25,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingHorizontal: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    icon: {
        height: 40,
        width: 40,
        marginBottom: 15,
    },
    currentEffect: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        backgroundColor: '#007AFF', // Change color as needed
        padding: 10,
        borderRadius: 5,
    },
    btnText: {
        color: '#FFFFFF', // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default App;
