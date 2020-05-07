import React from 'react'
import { StyleSheet, View,ActivityIndicator, TextInput, Button, Text, FlatList, ImageBackground, Platform, Dimensions, CheckBox, AsyncStorage, Image, Actions} from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { checkVerify, loadAll } from '../API/Api'
import CategorieItem from './CategorieItem'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment"
import CountDown from 'react-native-countdown-component';
import VentePriveeItem from './VentePriveeItem'
import firebase from 'firebase'


const { width, height } = Dimensions.get('window');

/**
 * ENV afficher prix
 */



class Catalogue extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id: null,
            email: null,
            tel: null,
            loaded: false,
            catalogue: [],
            produits: [],
            sousCategorie: [],
            vp: null,
            onScreen: null,
            refreshing: false
        }
        this.verified = false
        this.mailVerified = false
        this.telVerified = false
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerRight: () =>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity
                    style={styles.panierIcon}
                    onPress={() => params.function1()}>
                    <Icon
                        name="md-cart"
                        size={30}>
                    </Icon>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.panierIcon}
                    onPress={() => params.function2()}>
                    <Icon
                        name="md-contact"
                        size={32}>
                    </Icon>
                </TouchableOpacity>
            </View>      
        }
    };

    componentDidMount(){
        this.props.navigation.setParams({ function1: this.goToPanier.bind(this), function2: this.goToAccount.bind(this)})
        /*this.check()
        if(!this.verified & this._interval === undefined){
            this._interval = setInterval(() => {
                this.check();
                }, ENV.VERIFICATION_TIME);
        }*/

    }

    _setOnScreen = (categorie,boolVP,produitsList, sousCategorieList) => {
        this.props.navigation.navigate("CategorieDetail",{catInfo : categorie, vp: boolVP, produits: produitsList,sousCategorie: sousCategorieList, id:this.state.id})
    }

    signOut = () => {
        firebase.auth().signOut();
        this.props.navigation.replace("Login")
        this.clearAsyncStorage();
    }

    clearAsyncStorage = async () => {
        await AsyncStorage.clear();
        console.log("clear");
    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loadAllImageInCache(json){
        console.log("loading image in cache:")
        let urls = []
        var _ = require('lodash');
        _.find(json.categorie,
            function(item){
                urls.push(item.img)
        })
        _.find(json.ventePrivee,
            function(item){
                urls.push(item.img)
        })
        _.find(json.produits,
            function(item){
                item.img.map(url => {urls.push(url)})
        })

        let preFetchTasks = []; 

        urls.forEach((p)=>{
            preFetchTasks.push(Image.prefetch(p));
            
        });

        Promise.all(preFetchTasks).then((results)=>{
            let downloadedAll = true;
            results.forEach((result)=>{
                if(!result){
                    //error occurred downloading a pic
                    downloadedAll = false;
                }
            })
        })
        console.log("loaded image in cache")
    }

    goToPanier(){
        console.log("panier");
        this.props.navigation.navigate("Panier", {id:this.state.id})
    }

    goToAccount(){
        console.log("account");
        this.props.navigation.navigate("Account", {signOut: this.signOut.bind(this)})
    }

    async _load(){
        try{
            var idStored = await AsyncStorage.getItem("id");
            var emailStored = await AsyncStorage.getItem("email");
            var telStored = await AsyncStorage.getItem("tel");
            var catalogueStored = await AsyncStorage.getItem("catalogue");

            /*var panierTMP = await AsyncStorage.getItem("panier");
            let panier = JSON.parse(panierTMP)
            if(panier === null){
                panier = []
                await AsyncStorage.setItem("panier", JSON.stringify(panier))
            }*/

            console.log('id' + idStored);
            console.log("email" + emailStored);
            console.log("tel" + telStored);
            console.log("catalogue" + catalogueStored);

            if( (idStored !== null & (emailStored !== null | telStored !== null) & catalogueStored == null) 
                | this.state.refreshing ){

                
                let respAll = await loadAll();
                if(respAll.success){
                    
                    
                    // On sauvegarde
                    await AsyncStorage.setItem("catalogue",JSON.stringify(respAll.data))

                    // On récupère
                    
                    this.loadAllImageInCache(respAll.data)
                    //this.assignationProduits(catalogue)

                    
                    this.setState({
                        id:idStored,
                        email:emailStored,
                        tel:telStored,
                        loaded: true,
                        catalogue: respAll.data.categorie,
                        vp: respAll.data.ventePrivee,
                        produits: respAll.data.produits,
                        sousCategorie: respAll.data.sousCategorie,
                        refreshing: false
                    });
                }
            }else if (catalogueStored !== null){
                console.log("Loaded from Stored")
                var catalogue = JSON.parse(catalogueStored)

                this.setState({
                    id:idStored,
                    email:emailStored,
                    tel:telStored,
                    loaded: true,
                    catalogue: catalogue.categorie,
                    vp: catalogue.ventePrivee,
                    produits: catalogue.produits,
                    sousCategorie: catalogue.sousCategorie,
                    refreshing: false
                });
            }
        }catch(e){
            console.log(e);
        }
    }

    async removeItemValue() {
        try {
            await AsyncStorage.removeItem("id");
            Toast.show("reset");
            return true;
        }
        catch(exception) {
            return false;
        }
    }

    update(telVerified, mailVerified){
        this.telVerified = telVerified
        this.mailVerified = mailVerified
        this.setState({})
    }

    async check(){
        console.log("checked");
        
        let info = {
            id : this.state.id,
            email : this.state.email,
            tel : this.state.tel
        }
        let resp = await checkVerify(info)
        if(resp.success){
            if(!resp.data.email | !resp.data.tel){
                this.mailVerified = resp.data.email,
                this.telVerified = resp.data.tel
                this.props.navigation.navigate("Verification", {id: this.state.id, email: this.state.email, tel: this.state.tel, emailVerified: resp.data.email, telVerified: resp.data.tel, update: this.update.bind(this)})
            }else{
                this.verified = true
                this.mailVerified = resp.data.email,
                this.telVerified = resp.data.tel
                clearInterval(this._interval)
            }
        }else{
            console.log("fail")
        }
    }

    hadBeenVerified(){
        try{
            if(this.props.navigation.state.params.verified){
                this.verified = true
                this.mailVerified = this.props.navigation.state.params.mailVerified
                this.telVerified = this.props.navigation.state.params.telVerified
                clearInterval(this._interval)
                return true
            }
        }catch(e){
            return false
        }
    }
    
    getProduitsFor(idCategorie){
        let listProduits = []
        this.state.produits.map(produit => {
            if(produit.categorie.includes(idCategorie)){
                listProduits.push(produit)
            }
        })
        return listProduits
    }

    getSousCatFor(idCategorie){
        let listSousCat = [{"id":0,"name":"Tous"}]
        this.state.sousCategorie.map(sousCat => {
            if(sousCat.categorie.includes(idCategorie)){
                listSousCat.push(sousCat)
            }
        })
        return listSousCat
    }

    onRefresh(){
        this.setState({refreshing: true}, function() {this._load()})
        //this.setState({refreshing: true, catalogue:null,vp:null}, function() {this._load()})
        
    }

    onScreen(){
        if(this.state.id == null ){
            return(
                <View style={{flex:1,justifyContent:"center"}}>
                    <ActivityIndicator style={styles.loading} size='large' color={ENV.PRIMARY_COLOR}/>
                </View>
            )
        }else if(this.state.onScreen !== null){
            <ScrollView>
                
            </ScrollView>
        }else{
            
            return(
                <FlatList
                    style={styles.flatist}
                    data={this.state.catalogue}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <CategorieItem cat={item} _setOnScreen={this._setOnScreen} produits={this.getProduitsFor(item.slug)} sousCategorie={this.getSousCatFor(item.slug)}/>}
                    ListHeaderComponent={this.renderMultipleVp()}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.onRefresh()}
                    onEndReachedThreshold={1}
                />
            )
        }
    }

    renderMultipleVp(){
        if(this.state.vp !== null){
            return(
                <View style={styles.viewTouchVp}>
                    {this.state.vp.map((item,key) => <VentePriveeItem vpItem={item} key={item.id} verification={{telVerif: this.telVerified, mailVerif: this.mailVerified}} _setOnScreen={this._setOnScreen.bind(this)} check={this.check.bind(this)} produits={this.getProduitsFor(item.slug)} sousCategorie={this.getSousCatFor(item.slug)}/>)}
                </View>
            )
        }
    }

    render(){
        if(this.state.loaded){
            if(!this.hadBeenVerified()){
                this.check()
            }
        }else{
            this._load()
        }
        return(
            <View style={{flex:1}}>
                {this.onScreen()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        alignItems:"center",
        flex:1
    },
    flatist:{
    },
    viewTouchVp:{
        paddingBottom: 9,
    }, 
    touchVP:{
        height: 200,
        backgroundColor: 'transparent',
        paddingBottom: 1
    },
    iconVP:{
        flex:1,
        alignItems:"center",
        justifyContent:'center',
        marginBottom:30
    },
    textVP:{
        alignItems:"center",
        justifyContent:'center',
        fontSize: 40,
        fontFamily: 'pacifico',
    },
    dateVP:{
        fontSize: 30,
        fontWeight: 'bold'
    },
    dateVPFin:{
        fontSize: 20,
        fontWeight:"bold",
        marginBottom:5  
    },
    viewVP:{
        flex:2,
        alignItems:"center",
        justifyContent:'center',
        height: '100%',
        width: '100%',
    },
    imagesBoxVP:{
        height: '100%',
        width: '100%',
    },
    imageVP:{
        opacity:0.75
    },
    imageVPLock:{
        opacity: 0.2,
    },
    imageVPNotOnTime:{
        opacity: 0.5
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    panierIcon: {
        width: 40
    }
})

export default Catalogue