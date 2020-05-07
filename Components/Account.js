import React from 'react'
import { StyleSheet,KeyboardAvoidingView, View, TextInput,Dimensions, Button, Text, FlatList, ActivityIndicator, Platform, CheckBox ,AsyncStorage} from 'react-native'
import ENV from '../environment'
import {getIdFromRegistration} from "../API/Api"
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/Ionicons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'firebase'
const { width, height } = Dimensions.get('window');

class InfoPerso extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id: null,
            email: null,
            tel: null,
            prenom: null, 
            nom: null,
            adresse: null,
            complementAdresse: null,
            codePostal: null,
            ville: null,
            pays: null,
            loading: true,
            signOut: this.props.navigation.state.params.signOut
        }
    }

    componentDidMount(){
        this.loadStorageId();
        this.mounted = true;
    }

    async loadStorageId(){
        console.log("load")
        try{
            var idStored = await AsyncStorage.getItem("id");
            var prenomTMP = await AsyncStorage.getItem("prenom");
            var nomTMP = await AsyncStorage.getItem("nom");

            firebase
            .database()
            .ref('/users/' + idStored)
            .once('value')
            .then(async function(snapchot){
                await AsyncStorage.setItem("adresse", snapchot.val()['adresse']);
                await AsyncStorage.setItem("CP", snapchot.val()['cp']);
                await AsyncStorage.setItem("ville", snapchot.val()['ville']);
                await AsyncStorage.setItem("pays", snapchot.val()['pays']);
                console.log(snapchot.val()['complementAdresse'])
                if(snapchot.val()['complementAdresse'] !== undefined){
                    
                    await AsyncStorage.setItem("compAdresse", snapchot.val()['complementAdresse'])
                }

                await AsyncStorage.setItem("Factadresse", snapchot.val()['Factadresse']);
                await AsyncStorage.setItem("FactCP",snapchot.val()['Factcp']);
                await AsyncStorage.setItem("Factville",snapchot.val()['Factville']);
                await AsyncStorage.setItem("Factpays",snapchot.val()['Factpays']);
                if(snapchot.val()['FactcomplementAdresse'] !== undefined){
                    await AsyncStorage.setItem("FactcompAdresse", snapchot.val()['FactcomplementAdresse'])
                }

                await AsyncStorage.setItem("sameAdresse",JSON.stringify(snapchot.val()['sameAdresse']));  
                console.log("information set")
            }.bind(this))


            this.setState({
                id: idStored,
                prenom: prenomTMP, 
                nom: nomTMP,
                loading: false
            })
        }
        catch(e){
            console.log(e);
        }
    }



    render(){
        if(this.state.loading){
            return(
                <View style={{flex: 1, justifyContent: "center",}}>
                    <ActivityIndicator
                        color={ENV.PRIMARY_COLOR} 
                        size='large'/>
                </View>
            )
        }
        return(
            <View>
                <View style={styles.icon_container}>
                    <Icon
                        name="md-contact"
                        color="grey"
                        size={width*0.30}>
                    </Icon>
                </View>
               
                <View style={styles.info_container}>
                    <Text style={styles.textNom}>
                        {this.state.nom.toUpperCase()}
                    </Text>
                    <Text style={styles.textPrenom}>
                        {this.state.prenom}
                    </Text>
                </View>
                <View style={styles.nav_container}>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate("InfoPerso", {load: this.loadStorageId.bind(this)})}
                        activeOpacity={0.65}>
                        <Text style={styles.textButton}>Mes informations personnels</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate("MesCommandes", {id:this.state.id})}
                        activeOpacity={0.65}>
                        <Text style={styles.textButton} >Mes commandes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, {backgroundColor:"grey"}]}
                        onPress={() => {this.props.navigation.goBack(),this.state.signOut()}}
                        activeOpacity={0.65}>
                        <Text style={styles.textButton} >Déconnexion</Text>
                    </TouchableOpacity>

                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        flex:1
    },
    icon_container:{
        marginTop: 15,
        width: "100%",
        justifyContent:"center",
        alignItems:"center"
    },
    info_container:{
        width: "100%",
        alignItems:'center'
    },
    textNom:{
        fontWeight: "bold",
        fontSize: height*0.027,
        fontFamily: "josefin",
        color: ENV.PRIMARY_COLOR
    },
    textPrenom:{
        color: "grey",
        fontSize: height*0.020,
        fontFamily: "josefin"
    },
    nav_container:{
        marginTop:15,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }, 
    button:{
        marginTop: 15,
        borderRadius: 15,
        width: width*0.7,
        height: height *0.05,
        backgroundColor: ENV.PRIMARY_COLOR,
        justifyContent: "center"
    },
    textButton:{
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: height*0.02,
        fontFamily: "josefin",
    }
})

export default InfoPerso
