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

class Transporteur extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        const { transporteur, idTransporteur, setTransporteur} = this.props;
        let choix = null;
        if(transporteur.relais){
            choix = 
            <TouchableOpacity
                onPress={() => Alert.alert("On progress")}
            >
                <Text style={{textDecorationLine: "underline", color:ENV.PRIMARY_COLOR}}>Choisir mon point relais :</Text>
            </TouchableOpacity>
        }
        return(
            <TouchableOpacity 
                style={{height: 150, backgroundColor: "white", marginHorizontal: 10,marginVertical:1, borderRadius: 10}}
                onPress={() => setTransporteur(transporteur)}>

                <View 
                    style={{flexDirection: "row", alignItems: "center",marginLeft: 10}}
                    >
                    <Icon
                        style={{flex:0.1}}
                        name={(transporteur.id === idTransporteur) ? "ios-radio-button-on": "ios-radio-button-off"}
                        size={15}/>
                    <Image
                        source={{uri:transporteur.img, cache:"force-cache"}}
                        style={{ width: 120, height: 150, resizeMode:"contain"}}/>
                    <View style={{flex: 1, height:"80%", paddingLeft: 2}}>
                        <Text style={{fontWeight: "bold",fontSize: 15, textAlign: "center"}}>{transporteur.nom}</Text>
                        <View style={{marginLeft: 10,flex:0.8, justifyContent: "flex-end"}}>
                            <Text>{transporteur.type}</Text>
                            <Text>Delais de livraison : ~{transporteur.temps} jours ouvrés</Text>
                            <Text>Prix : {transporteur.prix*1.2} € TTC</Text>
                            {choix}
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

export default Transporteur;