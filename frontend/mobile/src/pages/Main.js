import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";

import api from '../services/api'

function Main() {

    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState("");

    const navigation = useNavigation();

    useEffect(() => {

        async function LoadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                });
            }

        }

        LoadInitialPosition();

    }, []);

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get("/search", {
            params: {
                latitude,
                longitude,
                techs: "ReactJS"
            }
        });

        console.log(response.data.devs);

        setDevs(response.data.devs);
    }

    function handleRegionChanged(region) {
        
        setCurrentRegion(region);
    }

    if (!currentRegion) {
        return null;
    }
   
    return (
        <View style={styles.container}>
            <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion}  style={styles.mapStyle}>
                {devs.map(dev => (
                    <Marker 
                        key={dev._id}
                        coordinate={{ 
                            longitude: dev.location.coordinates[0],
                            latitude: dev.location.coordinates[1],                              
                        }}
                    >
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }}></Image>
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username });
                        }}>
                            <View style={styles.callout}>
                    <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput style={styles.input}></TextInput>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={text => setTechs(text)}
                    value={techs}
                />
                <TouchableOpacity style={styles.loadButton} onPress={loadDevs} >
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: "#FFF"
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: "bold",
        fontSize: 16
    },
    devBio: {
        color: "#666",
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        display: "flex",
        flexDirection: "row"
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: "#FFF",
        color: "#333",
        borderRadius: 23,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2,

    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: "#8E4DFF",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15
    }
});

export default Main;