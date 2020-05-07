import React from 'react'
import {KeyboardAvoidingView, Animated, StyleSheet, View, Image, Text, Dimensions, AsyncStorage, Button, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { TouchableOpacity, TouchableHighlight, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { addAdresse } from '../API/Api'
import ImageSlider from './ImageSlider'
import ProduitItemPanier from './ProduitItemPanier'

const { width, height } = Dimensions.get('window');

class MoyenPaiement extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        const { moyenPaiement, idPaiement, setPaiement} = this.props;
        
        return(
            <TouchableOpacity 
                style={{height: 75, backgroundColor: "white", marginHorizontal: 10,marginVertical:1, borderRadius: 10}}
                onPress={() => setPaiement(moyenPaiement)}>

                <View 
                    style={{flexDirection: "row", alignItems: "center",justifyContent:"center",marginLeft: 10}}
                    >
                    <Icon
                        style={{flex:0.1}}
                        name={(moyenPaiement.id === idPaiement) ? "ios-radio-button-on": "ios-radio-button-off"}
                        size={15}/>
                    <View style={{flex: 1, height:"80%", paddingLeft: 2}}>
                        <Text style={{fontWeight: "bold",fontSize: 15, textAlign: "left"}}>{moyenPaiement.nom}</Text>
                        <View style={{marginLeft: 10}}>
                            <Text>Delais : ~{moyenPaiement.temps} jours ouvrés</Text>
                        </View>
                    </View>
                    
                </View>
                
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    adresseTransport:{
        flex: 0.05,
        height: "100%", 
        width:"100%", 
        backgroundColor: "white",
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        elevation: 0.1,
        justifyContent: "flex-start",
        alignItems: "center"
    }
})

export default MoyenPaiement;