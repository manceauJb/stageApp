import React from 'react'
import { StyleSheet,KeyboardAvoidingView, View, TextInput,Dimensions, Button, Text, FlatList, ActivityIndicator, Platform, CheckBox ,AsyncStorage, Alert} from 'react-native'
import ENV from '../environment'
import {getIdFromRegistration} from "../API/Api"
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/Ionicons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'firebase'
import Dialog from "react-native-dialog";


const { width, height } = Dimensions.get('window');

class InfoPerso extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loadBack: this.props.navigation.state.params.load,
            id: null,
            email: "",
            tel: "",
            prenom: "", 
            nom: "",
            
            adresse: "",
            complementAdresse: "",
            codePostal: "",
            ville: "",
            pays: "",

            sameAdresse: false,

            factAdresse: "",
            factComplementAdresse: "",
            factCodePostal: "",
            factVille: "",
            factPays: "",

            ValidNom: true,
            ValidPrenom: true,
            ValidAdresse: true,
            ValidCompAdresse: true,
            ValidCodePostal: true,
            ValidVille: true,
            ValidPays: true,
            ValidTel: true,
            ValidMail: true,

            factValidAdresse: true,
            factValidCompAdresse: true,
            factValidCodePostal: true,
            factValidVille: true,
            factValidPays: true,
        
            loading: true,

            alertPasswordVisibility: false,
            password: null,
            error_password_message: "",

            livraisonFull: false,
            facturationFull: false,

        }
    }

    componentDidMount(){
        if(this.state.loading){
            this.loadStorageId();
        }
    }

    componentWillUnmount(){
        console.log("unmount")
        this.state.loadBack()
    }

    async saveContent(){
        let result = true;

        let paternName = new RegExp('^[a-zA-Z_-]{3,20}$')
        let paternAdresse = new RegExp('^[0-9a-zA-Z_\. ]*')
        let paternCodePostal = new RegExp('^[0-9]{5}$');
        let paternVille = new RegExp('[a-zA-Z_-_\. ]*')
        let paternMail = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$')
        let paternTel = new RegExp('^[0-9]{10}$')


        let TMPValidPrenom = this.state.ValidPrenom;
        let TMPValidNom = this.state.ValidNom;
        let TMPValidAdresse = this.state.ValidAdresse;
        let TMPValidCompAdresse = this.state.ValidCompAdresse;
        let TMPValidCodePostal = this.state.ValidCodePostal;
        let TMPValidVille = this.state.ValidVille;
        let TMPValidPays = this.state.ValidPays;
        let TMPValidTel = this.state.ValidTel;
        let TMPValidEmail = this.state.ValidMail;

       
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

        if(this.state.tel === ("") | !paternTel.test(this.state.tel)){
            result = false
            TMPValidTel = false
        }else{
            TMPValidTel = true
        }
        if(this.state.email === ("") | !paternMail.test(this.state.email)){
            result = false
            TMPValidEmail = false
        }else{
            TMPValidEmail = true
        }

        if(result){
            try{
                await AsyncStorage.setItem("prenom", this.state.prenom);
                await AsyncStorage.setItem("nom",this.state.nom);
                
                await AsyncStorage.setItem("adresse", this.state.adresse);
                await AsyncStorage.setItem("CP", this.state.codePostal);
                await AsyncStorage.setItem("ville", this.state.ville);
                await AsyncStorage.setItem("pays", this.state.pays);
                await AsyncStorage.setItem("tel",this.state.tel);
                await AsyncStorage.setItem("email",this.state.email);
                if(this.state.complementAdresse !== null){
                    await AsyncStorage.setItem("compAdresse", this.state.complementAdresse);
                }

                await AsyncStorage.setItem("Factadresse",(this.state.sameAdresse)?this.state.adresse:this.state.factAdresse);
                if(this.state.complementAdresse != null && this.state.factComplementAdresse != null){
                    await AsyncStorage.setItem("FactcompAdresse",(this.state.sameAdresse)?this.state.complementAdresse:this.state.factComplementAdresse)
                }
                await AsyncStorage.setItem("FactCP",(this.state.sameAdresse)?this.state.codePostal:this.state.factCodePostal);
                await AsyncStorage.setItem("Factville",(this.state.sameAdresse)?this.state.ville:this.state.factVille);
                await AsyncStorage.setItem("Factpays",(this.state.sameAdresse)?this.state.pays:this.state.factPays);
                await AsyncStorage.setItem("sameAdresse",JSON.stringify(this.state.sameAdresse)); 
                
                var idStored = await AsyncStorage.getItem("id");
                firebase
                .database()
                .ref('/users/' + idStored)
                .update({
                    first_name:this.state.prenom,
                    last_name:this.state.nom,

                    adresse: this.state.adresse,
                    complementAdresse: this.state.complementAdresse,
                    cp: this.state.codePostal,
                    ville: this.state.ville,
                    pays: this.state.pays,

                    Factadresse: (this.state.sameAdresse)?this.state.adresse:this.state.factAdresse,
                    FactcomplementAdresse: (this.state.sameAdresse)?this.state.complementAdresse:this.state.factComplementAdresse,
                    Factcp: (this.state.sameAdresse)?this.state.codePostal:this.state.factCodePostal,
                    Factville: (this.state.sameAdresse)?this.state.ville:this.state.factVille,
                    Factpays: (this.state.sameAdresse)?this.state.pays:this.state.factPays,

                    sameAdresse: this.state.sameAdresse
                })
                .then(function(snapchot){
                    console.log(snapchot);
                }.bind(this))

                
                Toast.showSuccess("Informations sauvegardées")
            }catch(e){
                console.log(e)
            }
            
        }

        this.setState({
            ValidNom: TMPValidNom,
            ValidPrenom: TMPValidPrenom,
            ValidTel: TMPValidTel,
            ValidMail: TMPValidEmail,
            ValidAdresse: TMPValidAdresse,
            ValidCompAdresse: TMPValidCompAdresse,
            ValidCodePostal: TMPValidCodePostal,
            ValidVille: TMPValidVille,
            ValidPays: TMPValidPays,
        })

        console.log(this.state)
        console.log(result)
    }

    async loadStorageId(){
        try{
            var idStored = await AsyncStorage.getItem("id");
            var emailStored = await AsyncStorage.getItem("email");
            var telStored = await AsyncStorage.getItem("tel");

            var prenomTMP = await AsyncStorage.getItem("prenom");
            var nomTMP = await AsyncStorage.getItem("nom");

            var adresseStored = await AsyncStorage.getItem("adresse");
            var complementAdresseStored = await AsyncStorage.getItem("compAdresse")
            var cpStored = await AsyncStorage.getItem("CP");
            var villeStored = await AsyncStorage.getItem("ville");
            var paysStored = await AsyncStorage.getItem("pays");

            var factAdresseStored = await AsyncStorage.getItem("Factadresse");
            var factComplementAdresseStored = await AsyncStorage.getItem("FactcompAdresse")
            var factCpStored = await AsyncStorage.getItem("FactCP");
            var factVilleStored = await AsyncStorage.getItem("Factville");
            var factPaysStored = await AsyncStorage.getItem("Factpays");

            var sameAdresseStoredJSON = await AsyncStorage.getItem("sameAdresse");
            var sameAdresseStored = JSON.parse(sameAdresseStoredJSON);

            if(sameAdresseStored==null){
                sameAdresseStored = false;
            }

            this.setState({
                id: idStored,
                email: emailStored,
                tel: telStored,
                prenom: prenomTMP, 
                nom: nomTMP,
                adresse: adresseStored,
                complementAdresse: complementAdresseStored,
                codePostal: cpStored,
                ville: villeStored,
                pays: paysStored,
                loading: false,
                factAdresse: factAdresseStored,
                factComplementAdresse:factComplementAdresseStored,
                factCodePostal: factCpStored,
                factVille: factVilleStored,
                factPays: factPaysStored,
                sameAdresse: sameAdresseStored
            })
        }
        catch(e){
            console.log(e);
        }
    }

    async loadFact(){
        
        var factAdresseStored = await AsyncStorage.getItem("Factadresse");
        var factComplementAdresseStored = await AsyncStorage.getItem("FactcompAdresse")
        var factCpStored = await AsyncStorage.getItem("FactCP");
        var factVilleStored = await AsyncStorage.getItem("Factville");
        var factPaysStored = await AsyncStorage.getItem("Factpays");
        console.log(factAdresseStored)
        this.setState({
            factAdresse: factAdresseStored,
            factComplementAdresse:factComplementAdresseStored,
            factCodePostal: factCpStored,
            factVille: factVilleStored,
            factPays: factPaysStored,
            sameAdresse: false
        })
    }

    clearFact(){
        console.log("clearFact")
        this.setState({
            factAdresse: this.state.adresse,
            factComplementAdresse: this.state.complementAdresse,
            factCodePostal: this.state.codePostal,
            factVille: this.state.ville,
            factPays: this.state.pays,
            sameAdresse: true
        })
    }

    renderValidInput(bool){
        if(bool){
            return styles.textinput
        }else{
            return styles.textinputred
        }
    }

    updatePassword(){
        try {
            const user = firebase.auth().currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email, 
                this.state.password
            );
            user.reauthenticateWithCredential(credential)
            .then(function(){
                user.updatePassword(this.state.newpassword)
                .then(function(){
                    console.log("password updated");
                    
                    
                    this.setState({alertPasswordVisibility: false})
                }.bind(this))
                .catch(function(error){
                    console.log(error.message);
                    
                    this.setState({error_password_message: error.message})
                }.bind(this))
            }.bind(this))
            .catch(function(error){
                this.setState({error_password_message: error.message})
            }.bind(this))
            
        } catch (error) {
            console.log(error)
            
        }
    }


    renderAdresseLivraison(){
        if(this.state.livraisonFull){
            return(
                <View style={[styles.input_container]}>
                        <TouchableOpacity
                            onPress={() => this.setState({livraisonFull: !this.state.livraisonFull})}
                            style={styles.buttonDisplay}
                        >
                            <Text style={styles.textDisplay}>
                                Adresse de livraison
                            </Text>
                            <Icon 
                            name="ios-arrow-dropdown"
                            color={"white"}
                            size={height*0.045}/>

                        </TouchableOpacity>
                    <View style={styles.input}>
                        <Text style={styles.input_desc}>
                            Adresse
                        </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidAdresse)}
                            value={this.state.adresse}
                            placeholder="Adresse"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({adresse: text})}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.input_desc}>
                            Complement
                        </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidCompAdresse)}
                            value={this.state.complementAdresse}
                            placeholder="Complement d'adresse"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({complementAdresse: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={styles.input_desc}>
                            Code Postal
                        </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidCodePostal)}
                            value={this.state.codePostal}
                            placeholder="Code Postal"
                            keyboardType="numeric"
                            onChangeText={(text) => this.setState({codePostal: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={styles.input_desc}>
                            Ville
                        </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidVille)}
                            value={this.state.ville}
                            placeholder="Ville"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({ville: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={styles.input_desc}>
                            Pays
                        </Text>
                        <TextInput
                            style={this.renderValidInput(this.state.ValidPays)}
                            value={this.state.pays}
                            placeholder="Pays"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({pays: text})}
                        />
                    </View>
                </View>
            )
        }else{
            return(
                <View style={styles.input_container}>
                    <TouchableOpacity
                        style={styles.buttonDisplay}
                        onPress={() => this.setState({livraisonFull: !this.state.livraisonFull})}
                    >
                    <Text style={styles.textDisplay}>
                        Adresse de livraison
                    </Text>
                    <Icon 
                        name="ios-arrow-dropleft"
                        color={"white"}
                        size={height*0.045}/>
                    
                </TouchableOpacity>
                </View>
                
            )    
        }
    }

    renderAdresseFacturation(){
        if(this.state.facturationFull){
            let styleEditable = (this.state.sameAdresse)?{backgroundColor:"grey"}:{}
            let styleEditableInput = (this.state.sameAdresse)?{borderColor:"grey"}:{}
            return(
                <View style={[styles.input_container]}>
                        <TouchableOpacity
                            onPress={() => this.setState({facturationFull: !this.state.facturationFull})}
                            style={styles.buttonDisplay}
                        >
                            <Text style={styles.textDisplay}>
                                Adresse de facturation
                            </Text>
                            <Icon 
                            name="ios-arrow-dropdown"
                            color={"white"}
                            size={height*0.045}/>

                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.buttonAdresseContainer}
                            onPress={() => (!this.state.sameAdresse)? this.clearFact() : this.loadFact() }
                            >
                                <CheckBox
                                    color={ENV.PRIMARY_COLOR}
                                    value={this.state.sameAdresse}
                                />
                                <Text style={{textAlignVertical: "center"}}>
                                    Utiliser l'adresse de livraison
                                </Text>
                        </TouchableOpacity>
                    <View style={styles.input}>
                        <Text style={[styles.input_desc,styleEditable]}>
                            Adresse
                        </Text>
                        <TextInput
                            style={[this.renderValidInput((this.state.sameAdresse)?this.state.ValidAdresse:this.state.factValidAdresse),styleEditableInput]}
                            editable={!this.state.sameAdresse}
                            value={(this.state.sameAdresse)?this.state.adresse:this.state.factAdresse}
                            placeholder="Adresse"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({factAdresse: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={[styles.input_desc,styleEditable]}>
                            Complement
                        </Text>
                        <TextInput
                            editable={!this.state.sameAdresse}
                            style={[this.renderValidInput((this.state.sameAdresse)?this.state.ValidCompAdresse:this.state.factValidCompAdresse),styleEditableInput]}
                            value={(this.state.sameAdresse)?this.state.complementAdresse:this.state.factComplementAdresse}
                            placeholder="Complement d'adresse"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({factComplementAdresse: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={[styles.input_desc,styleEditable]}>
                            Code Postal
                        </Text>
                        <TextInput
                            editable={!this.state.sameAdresse}
                            style={[this.renderValidInput((this.state.sameAdresse)?this.state.ValidCodePostal:this.state.factValidCodePostal),styleEditableInput]}
                            value={(this.state.sameAdresse)?this.state.codePostal:this.state.factCodePostal}
                            placeholder="Code Postal"
                            keyboardType="numeric"
                            onChangeText={(text) => this.setState({factCodePostal: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={[styles.input_desc,styleEditable]}>
                            Ville
                        </Text>
                        <TextInput
                            editable={!this.state.sameAdresse}
                            style={[this.renderValidInput((this.state.sameAdresse)?this.state.ValidVille:this.state.factValidVille),styleEditableInput]}
                            value={(this.state.sameAdresse)?this.state.ville:this.state.factVille}
                            placeholder="Ville"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({factVille: text})}
                        />
                    </View>
    
                    <View style={styles.input}>
                        <Text style={[styles.input_desc,styleEditable]}>
                            Pays
                        </Text>
                        <TextInput
                            editable={!this.state.sameAdresse}
                            style={[this.renderValidInput((this.state.sameAdresse)?this.state.ValidPays:this.state.factValidPays),styleEditableInput]}
                            value={(this.state.sameAdresse)?this.state.pays:this.state.factPays}
                            placeholder="Pays"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({factPays: text})}
                        />
                    </View>
                </View>
            )
        }else{
            return(
                <View style={styles.input_container}>
                    <TouchableOpacity
                        style={styles.buttonDisplay}
                        onPress={() => this.setState({facturationFull: !this.state.facturationFull})}
                    >
                    <Text style={styles.textDisplay}>
                        Adresse de facturation
                    </Text>
                    <Icon 
                        name="ios-arrow-dropleft"
                        color={"white"}
                        size={height*0.045}/>
                    
                </TouchableOpacity>
                </View>
                
            )    
        }
    }

    renderStyleInput(Valid){
        if(!Valid){
            return {color: "red"}
        }else{
            return {}
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
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center'}} behavior="height" enabled   keyboardVerticalOffset={100}>

            <ScrollView style={styles.main_container}>
            
                <View style={styles.icon_container}>
                    <Icon
                        name="md-contact"
                        color="grey"
                        size={width*0.30}>
                    </Icon>
                </View>
               
                <View 
                    style={styles.info_container}>
                    <TextInput
                        style={[styles.textNom,this.renderStyleInput(this.state.ValidNom)]}
                        value={this.state.nom}
                        placeholder="Nom"
                        keyboardType="default"
                        onChangeText={(text) => this.setState({nom: text})}
                    />
                    <TextInput
                        style={[styles.textPrenom,this.renderStyleInput(this.state.ValidPrenom)]}
                        value={this.state.prenom}
                        placeholder="Prénom"
                        keyboardType="default"
                        onChangeText={(text) => this.setState({prenom: text})}
                    />

                    <TouchableOpacity
                        style={styles.passwordButton}
                        onPress={() => this.setState({alertPasswordVisibility: true})}>
                        <Text style={styles.passwordText}>
                            Changer de mot de passe
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.passwordButton}>
                        <TextInput 
                            style={[styles.textPrenom,this.renderStyleInput(this.state.ValidMail)]}
                            value={this.state.email}
                            placeholder="Email"
                            keyboardType="default"
                            onChangeText={(text) => this.setState({email: text})}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.passwordButton}>
                        <TextInput 
                            style={[styles.textPrenom,this.renderStyleInput(this.state.ValidTel)]}
                            value={this.state.tel}
                            placeholder="Téléphone"
                            keyboardType="numeric"
                            onChangeText={(text) => this.setState({tel: text})}
                        />
                    </TouchableOpacity>

                    <Dialog.Container visible={this.state.alertPasswordVisibility}>
                        <Dialog.Title>Changer de mot de passe</Dialog.Title>
                        <Dialog.Input 
                            label="Ancien mot de passe" 
                            style={styles.passwordtextinput}
                            placeholder="Ancien mot de passe"
                            keyboardType="numeric"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({password: text})}
                        />
                        <Dialog.Input 
                            label="Nouveau mot de passe" 
                            style={styles.passwordtextinput}
                            placeholder="Nouveau mot de passe"
                            keyboardType="numeric"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({newpassword: text})}
                        />
                        <Dialog.Description style={{color:'red'}}>{this.state.error_password_message}</Dialog.Description>
                        <Dialog.Button label="Annuler" onPress={() => this.setState({alertPasswordVisibility: false})}/>
                        <Dialog.Button label="Changer" onPress={() => { this.updatePassword() }}/>
                        
                    </Dialog.Container>

                    {this.renderAdresseLivraison()}
                    {this.renderAdresseFacturation()}
                    
                    <TouchableOpacity
                        style={styles.icon_save}
                        onPress={() => this.saveContent()}
                    >
                        <Icon
                            name="ios-save"
                            color={ENV.PRIMARY_COLOR}
                            size={width*0.12}>
                        </Icon>

                    </TouchableOpacity>

                </View>
                
                
            </ScrollView>
            </KeyboardAvoidingView>
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
        textAlign: "center",
        fontWeight: "bold",
        fontSize: height*0.027,
        fontFamily: "josefin",
        color: ENV.PRIMARY_COLOR,
        textDecorationLine: "underline"
    },
    textPrenom:{
        textAlign: "center",
        color: "grey",
        fontSize: height*0.020,
        fontFamily: "josefin",
        textDecorationLine: "underline"
    },
    input:{
        flexDirection: 'row',
        width: '90%',
        marginBottom: 20,
        textDecorationLine: "underline",
        height: height*0.04
    },
    input_desc:{
        flex: 1.3,
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
    input_container:{
        alignItems:"center"
    },
    icon_save:{
        width: width*0.15,
        height:  width*0.15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 20,
        borderColor: ENV.PRIMARY_COLOR
    }, 
    passwordButton: {
        marginTop: 5,
        marginBottom: 15
    }, 
    passwordText:{
        color: ENV.PRIMARY_COLOR,
        textDecorationLine: "underline"
    },
    buttonDisplay:{
        height: height*0.05,
        flexDirection:"row",
        justifyContent: "space-around",
        width: width*0.8,
        borderColor: ENV.PRIMARY_COLOR,
        borderWidth: 2,
        marginBottom: 20,
        backgroundColor: ENV.PRIMARY_COLOR,
        borderRadius: 20
    },
    textDisplay:{
        flex:2,
        fontFamily:"josefin",
        fontWeight:"bold",
        fontSize: height*0.02,
        height:"100%",
        textAlignVertical:"center",
        color:"white",
        marginLeft:15
    },
    buttonAdresseContainer:{
        flexDirection: "row",
        alignContent: "center",
        width:"100%"
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
    passwordtextinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        paddingLeft: 5,
        fontFamily: 'josefin',
    }
})

export default InfoPerso
