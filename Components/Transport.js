import React from 'react'
import {KeyboardAvoidingView, Animated, StyleSheet, View, Image, Text, Dimensions, AsyncStorage, Button, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { TouchableOpacity, TouchableHighlight, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { addAdresse, addTransporteur } from '../API/Api'
import ImageSlider from './ImageSlider'
import ProduitItemPanier from './ProduitItemPanier'
import Transporteur from "./Transporteur"

const { width, height } = Dimensions.get('window');

class Transport extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            id: null,
            prenom: "",
            nom: "",
            adresse: "",
            compAdresse: "",
            codePostal: "",
            ville: "",
            pays: "",
            telephone: "",
            
            ValidPrenom: true,
            ValidNom: true,
            ValidAdresse: true,
            ValidCompAdresse: true,
            ValidCodePostal: true,
            ValidVille: true,
            ValidPays: true,
            ValidTelephone: true,

            input: false,
            loading : true,
            transporteur : false,

            transporteurs: [],
            idTransporteur: null,

            prixHT: this.props.navigation.state.params.prixHT,
            prixTVA: this.props.navigation.state.params.prixTVA,
            prixLivraison: null
        }
    }

    componentDidMount(){
        this.loadName()
    }

    renderValidInput(bool){
        if(bool){
            return styles.textinput
        }else{
            return styles.textinputred
        }
    }

    async getTransporteur(){
        var resp = await addAdresse(this.state);

        if(resp.success){
            console.log("add adresse")
            console.log(resp)
            this.setState({loading:false, transporteur: true, transporteurs: resp.data.transporteurs})
        }
    }

    async loadName(){
        var prenomTMP = await AsyncStorage.getItem("prenom");
        var nomTMP = await AsyncStorage.getItem("nom");
        var telTMP = await AsyncStorage.getItem("tel");
        var idTMP = await AsyncStorage.getItem("id");

        var adresseStored = await AsyncStorage.getItem("adresse");
        var complementAdresseStored = await AsyncStorage.getItem("compAdresse")
        var cpStored = await AsyncStorage.getItem("CP");
        var villeStored = await AsyncStorage.getItem("ville");
        var paysStored = await AsyncStorage.getItem("pays");


        this.setState({
            id: idTMP, 
            prenom: prenomTMP, 
            nom: nomTMP, 
            telephone: telTMP, 
            adresse: (adresseStored!== null)? adresseStored : "",
            compAdresse:  (complementAdresseStored !== null)? complementAdresseStored : "",
            codePostal:  (cpStored !== null)? cpStored : "",
            pays:  (paysStored !== null)? paysStored : "",
            ville:  (villeStored !== null)? villeStored : "",
            loading: false, 
            input: true})
    }

    async validerTransport(){
        if(this.state.idTransporteur!== null){
            let resp = await addTransporteur({id:this.state.id,idLiv:this.state.idTransporteur})
            if(resp.success){
                this.props.navigation.navigate("Paiement", {  prixHT: resp.data['total'].totalHT, prixTVA: resp.data['total'].totalTVA, prixTTC: resp.data['total'].totalTTC, prixLivraison: this.state.prixLivraison});
            }
            
        }else{
            Toast.show("Veuillez choisir un transporteur")
        }
    }

    checkContent(){
        let result = true;

        let paternName = new RegExp('^[a-zA-Z_-]{3,20}$')
        let paternAdresse = new RegExp('^[0-9a-zA-Z_\. ]*')
        let paternCodePostal = new RegExp('^[0-9]{5}$');
        let paternVille = new RegExp('[a-zA-Z_-_\. ]*')
        let paternTel = new RegExp('^[0-9]{10}$');

        let TMPValidPrenom = this.state.ValidPrenom;
        let TMPValidNom = this.state.ValidNom;
        let TMPValidAdresse = this.state.ValidAdresse;
        let TMPValidCompAdresse = this.state.ValidCompAdresse;
        let TMPValidCodePostal = this.state.ValidCodePostal;
        let TMPValidVille = this.state.ValidVille;
        let TMPValidPays = this.state.ValidPays;
        let TMPValidTelephone = this.state.ValidTelephone;

        let input = true;
        let loading = false;
        let transporteur = false;

        if(this.state.prenom === ("") | !paternName.test(this.state.prenom)){
            result = false;
            TMPValidPrenom = false;
        }else{
            TMPValidPrenom = true;
        }

        if(this.state.nom === ("") | !paternName.test(this.state.nom)){
            result = false;
            TMPValidNom = false;
        }else{
            TMPValidNom = true;
        }

        if(this.state.adresse === ("") | !paternAdresse.test(this.state.adresse)){
            result = false;
            TMPValidAdresse = false;
        }else{
            TMPValidAdresse = true;
        }

        if(this.state.codePostal === ("") | !paternCodePostal.test(this.state.codePostal)){
            result = false;
            TMPValidCodePostal = false;
        }else{
            TMPValidCodePostal = true;
        }

        if(this.state.ville === ("") | !paternVille.test(this.state.ville)){
            result = false;
            TMPValidVille = false;
        }else{
            TMPValidVille = true;
        }

        if(this.state.pays === ("") | !paternVille.test(this.state.pays)){
            result = false;
            TMPValidPays = false;
        }else{
            TMPValidPays = true;
        }

        if(this.state.telephone == ("") | !paternTel.test(this.state.telephone)){
            result = false;
            TMPValidTelephone = false;
        }else{
            TMPValidTelephone = true;
        }
        
        if(result){
            transporteur = true;
            input = false;
            try{
                AsyncStorage.setItem("prenom", this.state.prenom);
                AsyncStorage.setItem("nom", this.state.nom);
                AsyncStorage.setItem("adresse", this.state.adresse);
                AsyncStorage.setItem("CP", this.state.codePostal);
                AsyncStorage.setItem("ville", this.state.ville);
                AsyncStorage.setItem("pays", this.state.pays);
                AsyncStorage.setItem("tel", this.state.telephone);
                if(this.state.complementAdresse !== ""){
                    AsyncStorage.setItem("compAdresse", this.state.complementAdresse);
                }
                Toast.show("Informations sauvegardées")
            }catch(e){
                console.log(e)
            }
        }

        this.setState({
            ValidPrenom: TMPValidPrenom,
            ValidNom: TMPValidNom,
            ValidAdresse: TMPValidAdresse,
            ValidCompAdresse: TMPValidCompAdresse,
            ValidCodePostal: TMPValidCodePostal,
            ValidVille: TMPValidVille,
            ValidPays: TMPValidPays,
            ValidTelephone: TMPValidTelephone,
        })
        console.log(this.state)
        return result;
    }

    returnInput(){
        return(
            <View style={{flex:1}}>

                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center', marginTop: 20}} behavior="height" enabled   keyboardVerticalOffset={100}>
                    <ScrollView style={{flex:1}}>
                    <View>
                        <Text>
                            Adresse de livraison
                        </Text>
                    </View>

                    <View >
                        <View style={styles.input}>
                            <Text  style={styles.input_desc}>Prénom </Text>
                            <TextInput
                                style={this.renderValidInput(this.state.ValidPrenom)}
                                placeholder="Prénom"
                                keyboardType="default"
                                value={this.state.prenom}
                                onChangeText={(text) => this.setState({prenom:text})}
                                onSubmitEditing={(text) => {
                                    this.second.focus()
                                }}
                            />
                        </View>
                    
                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Nom </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidNom)}
                            ref={(input) => this.second = input }
                            value={this.state.nom}
                            placeholder="Nom"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({nom:text})}
                            onSubmitEditing={(text) => {
                                this.third.focus()
                            }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Adresse </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidAdresse)}
                            ref={(input) => this.third = input }
                            placeholder="Adresse"
                            value={this.state.adresse}
                            keyboardType="default"
                            onChangeText={(text) => this.setState({adresse:text})}
                            onSubmitEditing={(text) => {
                                this.fourth.focus()
                            }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Complément d'adresse </Text>
                        <TextInput
                            style={styles.textinput}
                            ref={(input) => this.fourth = input }
                            placeholder="(optionnel)"
                            keyboardType="default"
                            value={this.state.compAdresse}
                            onChangeText={(text) => this.setState({compAdresse:text})}
                            onSubmitEditing={(text) => {
                                this.fifth.focus()
                            }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Code Postal</Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidCodePostal)}
                            ref={(input) => this.fifth = input }
                            placeholder="Code postal"
                            keyboardType="numeric"
                            value={this.state.codePostal}
                            onChangeText={(text) => this.setState({codePostal:text})}
                            onSubmitEditing={(text) => {
                                this.sixth.focus()
                            }}
                        />
                    </View>
                    
                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Ville</Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidVille)}
                            ref={(input) => this.sixth = input }
                            placeholder="Ville"
                            value={this.state.ville}
                            keyboardType="default"
                            onChangeText={(text) => this.setState({ville:text})}
                            onSubmitEditing={(text) => {
                                this.seventh.focus()
                            }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Pays</Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidPays)}
                            ref={(input) => this.seventh = input }
                            placeholder="Pays"
                            value={this.state.pays}
                            keyboardType="default"
                            onChangeText={(text) => this.setState({pays:text})}
                            onSubmitEditing={(text) => {
                                this.eighth.focus()
                            }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text  style={styles.input_desc}>Téléphone</Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidTelephone)}
                            ref={(input) => this.eighth = input }
                            placeholder="Téléphone"
                            value={this.state.telephone}
                            keyboardType="numeric"
                            onChangeText={(text) => this.setState({telephone:text})}
                        />
                    </View>            
                        </View>
                    </ScrollView>
                    
                </KeyboardAvoidingView>
                
                <Button
                        color={ENV.PRIMARY_COLOR}
                        title='Valider mon adresse'
                        onPress={() => {
                            console.log(this.state)
                            if(this.checkContent()){
                                this.setState({input: false, loading: true})
                                this.getTransporteur()
                            }
                        }
                        }
                    />            

            </View>
        )
    }

    setTransporteur(transporteur){
        this.setState({idTransporteur:transporteur.id,prixLivraison: transporteur.prix * 1.2})
        console.log(this.state)
    }

    returnListeTransporteurs(){
        console.log(this.state.transporteurs)
        return(
            <View style={{flex:1}}>
                <View style={{flex: 1}}>
                    <View style={styles.adresseTransport}>
                        <Text>Adresse de livraison : {this.state.adresse + ", " + this.state.codePostal + " " + this.state.ville}</Text>
                        <TouchableOpacity 
                            onPress={() => this.setState({transporteur: false, input: true})}
                        >
                            <Icon 
                                name={"md-create"}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <FlatList 
                        style={{flex:1}}
                        data={this.state.transporteurs}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => <Transporteur transporteur={item} idTransporteur={this.state.idTransporteur} setTransporteur={this.setTransporteur.bind(this)}/>}
                    />
                </View>
                <View style={styles.recapContainer}>
                    <Text style={styles.prixHT}>Sous-Total :{(this.state.prixHT+ this.state.prixTVA).toFixed(2)} €</Text>
                    {(this.state.prixLivraison !== null) ? <Text style={styles.prixHT}>Livraison : {this.state.prixLivraison.toFixed(2)} €</Text> : <Text style={styles.prixHT}>Livraison : Veuillez choisir</Text>}
                    <Text style={styles.prixTTC}>Total :{(this.state.prixHT+ this.state.prixTVA + this.state.prixLivraison).toFixed(2)} € </Text>
                </View>
                <Button 
                    title={"Proceder au paiement"}
                    color={ENV.PRIMARY_COLOR}
                    onPress={() => this.validerTransport()}
                />
            </View>
        )
    }

    render(){
        let render = null;
        
        if(this.state.loading){
            render = 
                <View style={{flex: 1, justifyContent: "center",}}>
                    <ActivityIndicator
                        color={ENV.PRIMARY_COLOR} 
                        size='large'/>
                </View>
        }else if(this.state.input){
            render = this.returnInput();
        }else if(this.state.transporteur){
            render = this.returnListeTransporteurs();
        }

        return(
            render
        )
    }

}

const styles = StyleSheet.create({
    input:{
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
        height: height*0.05
    },
    input_desc:{
        flex: 1,
        height: height*0.05,
        textAlignVertical: "center",
        textAlign: "center",
        backgroundColor: ENV.PRIMARY_COLOR,
        color: "white",
        fontSize: height*0.02,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },
    textinput: {
        flex: 3,
        marginRight: 5,
        fontSize: height*0.02,
        height: height*0.05,
        borderColor: ENV.PRIMARY_COLOR,
        borderWidth: 1,
        paddingLeft: 5,
        width: '100%',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    textinputred: {
        flex: 3,
        color: 'red',
        marginRight: 5,
        fontSize: height*0.02,
        height: height*0.05,
        borderColor: 'red',
        borderWidth: 1,
        paddingLeft: 5,
        width: '100%',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    adresseTransport:{
        flexDirection: "row",
        flex: 0.05,
        height: "100%", 
        width:"100%", 
        backgroundColor: "white",
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        elevation: 0.1,
        justifyContent: "space-around",
        alignItems: "center"
    },
    main_container: {
        flex: 1
    },
    recapContainer:{
        flexDirection : "column",
        justifyContent: "center",
        paddingRight: 10,
        flex:0.12, 
        height: "100%", 
        backgroundColor:"grey"
    },
    prixHT:{
        textAlign: "right"
    },
    prixTVA:{
        textAlign: "right"
    },
    prixTTC:{
        textAlign: "right",
        fontSize: 17,
        fontWeight: "bold"
    },
})

export default Transport