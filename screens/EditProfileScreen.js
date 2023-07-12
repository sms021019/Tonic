import React, {useContext, useLayoutEffect, useState} from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, Flex, ScrollView} from "native-base";
import theme from "../utils/theme";
import {NavigatorType, PageMode, windowWidth} from "../utils/utils";
import styled from "styled-components/native";
import {flexCenter, TonicButtonWhite} from "../utils/styleComponents";
import GlobalContext from "../context/Context";
import {Feather} from "@expo/vector-icons";

export default function EditProfileScreen({navigation}) {
    const {gUserModel} = useContext(GlobalContext);
    const [username, setUsername] = useState(gUserModel.model.username);
    const [save, setSave] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Edit Profile",
            headerRight: () =>
                <Button
                    onPress={() => setSave(true)}
                    title={"Save"}
                />
        });
    }, [navigation]);


    function handleEditProfile() {

    }

    return (
        <ScrollView style={styles.container}>
            <View marginTop={10}>
                <Center style={styles.profileImageBox}>
                    <Box style={styles.profileImageBig}/>
                </Center>
                <Flex alignItems={'center'} marginRight={12} marginLeft={12}>
                    <Flex direction={'row'} m={1}>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                    </Flex>
                    <Flex direction={'row'} m={1}>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                        <Box style={styles.pArea}>
                            <Box style={styles.profileImageSmall}/>
                        </Box>
                    </Flex>
                </Flex>
            </View>
            <Center marginTop={12}>
                <View marginTop={5}>
                    <Text style={styles.boldText}>
                        Nickname
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                </View>
            </Center>
        </ScrollView>
    )
}




const styles = StyleSheet.create({
    container: {
        minWidth: windowWidth,
        backgroundColor: 'white'
    },
    profileImageBox: {width: windowWidth, height: 150},
    pArea: {display:'flex', flex:1, alignItems:'center', justifyContent:'center'},
    profileImageBig: {width: 120, height: 120, borderRadius: 100, backgroundColor: 'gray'},
    profileImageSmall: {width: 60, height: 60, borderRadius: 100, backgroundColor: 'gray'},
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    formContainer: {
        width: '70%',
    },
    boldText:          { fontWeight: '700', fontSize: 16, margin: 7, color:theme.colors.text},
})


const Container = styled.View`
    ${flexCenter};
    background-color: #fff;
    align-items: center;
    justify-content: center;
`;


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
//
// const EditProfileScreen = () => {
//     const [username, setUsername] = useState('');
//     const [profilePicture, setProfilePicture] = useState('');
//     const [selectedPictureIndex, setSelectedPictureIndex] = useState(null);
//
//     const handleUsernameChange = (text) => {
//         setUsername(text);
//     };
//
//     const handleProfilePictureChange = (text) => {
//         setProfilePicture(text);
//     };
//
//     const handleSaveChanges = () => {
//         // Add code to save changes to the database here
//     };
//
//     const handleSelectPicture = (index) => {
//         setSelectedPictureIndex(index);
//         setProfilePicture(`https://picsum.photos/id/${index}/200/200`);
//     };
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.profilePictureContainer}>
//                 <Image
//                     source={{ uri: profilePicture }}
//                     style={styles.profilePicture}
//                 />
//             </View>
//             <View style={styles.formContainer}>
//                 <Text style={styles.title}>Edit Profile</Text>
//                 <TextInput
//                     placeholder="Username"
//                     value={username}
//                     onChangeText={handleUsernameChange}
//                     style={styles.input}
//                 />
//                 <Text style={styles.subtitle}>Select Profile Picture:</Text>
//                 <View style={styles.pictureGrid}>
//                     {[...Array(9)].map((_, index) => (
//                         <View
//                             key={index}
//                             style={[
//                                 styles.pictureContainer,
//                                 selectedPictureIndex === index && styles.selectedPictureContainer,
//                             ]}
//                         >
//                             <Image
//                                 source={{ uri: `https://picsum.photos/id/${index}/200/200` }}
//                                 style={styles.picture}
//                             />
//                             <Button title="Select" onPress={() => handleSelectPicture(index)} />
//                         </View>
//                     ))}
//                 </View>
//                 <Button title="Save Changes" onPress={handleSaveChanges} />
//             </View>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     profilePictureContainer: {
//         width: 150,
//         height: 150,
//         borderRadius: 75,
//         overflow: 'hidden',
//         marginBottom: 20,
//     },
//     profilePicture: {
//         width: '100%',
//         height: '100%',
//     },
//     formContainer: {
//         width: '80%',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         marginBottom: 20,
//     },
//     subtitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     pictureGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     pictureContainer: {
//         width: '30%',
//         aspectRatio: 1 / 1,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: '#ccc',
//         borderRadius: StyleSheet.hairlineWidth * 10,
//         overflow: 'hidden',
//         marginBottom: '5%',
//     },
//     selectedPictureContainer:{
//         borderColor:'blue'
//     },
//     picture:{
//         width:'100%',
//         height:'100%'
//     }
// });
//
// export default EditProfileScreen;
