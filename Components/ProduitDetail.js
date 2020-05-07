import React from 'react'
import { Animated, StyleSheet, View, Image, Text, Dimensions, AsyncStorage, Button, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { TouchableOpacity, TouchableHighlight, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { addToPanier } from '../API/Api'

import ImageSlider from './ImageSlider'

const { width, height } = Dimensions.get('window');


class ProduitDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id:this.props.navigation.state.params.id,
            produit: this.props.navigation.state.params.produit,
            vp: this.props.navigation.state.params.vp,
            fullscreen: false,
            qte : 1,
            panier: null,
            loadingPanier: false
        }
        this.functionDisableComp = null;
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.screenTitle : 'Produit',
            headerRight: () => !params.fullscreen ? null :
                <TouchableOpacity
                    style={styles.exitIcon}
                    onPress={() => { params.function(), params.functionCom() }}>
                    <Icon
                        name="md-close"
                        size={30}>
                    </Icon>
                </TouchableOpacity>
        }
    };

    componentDidMount() {
        this.loadPanier()
        this.props.navigation.setParams({ screenTitle: this.state.produit.titre + " ", fullscreen: this.state.fullscreen, function: this.setImageFullScreen.bind(this), functionCom: this.functionDisableComp })
    }

    async loadPanier() {
        var panierStored = await AsyncStorage.getItem("panier");
        if(panierStored !== null){
            this.setState({panier: JSON.parse(panierStored)})
        }else{
            let panier = [];
            await AsyncStorage.setItem("panier", JSON.stringify(panier));
        }
    }

    setImageFullScreen() {
        
        this.props.navigation.setParams({ fullscreen: !this.state.fullscreen, function: this.setImageFullScreen.bind(this), functionCom: this.functionDisableComp });
        this.setState({ fullscreen: !this.state.fullscreen })
    }

    setImageFullScreenFromComp(disable) {
        this.functionDisableComp = disable;
        this.setImageFullScreen();
    }

    setQte(qte){
        if(qte >= 1){
            this.setState({qte:qte})
        }
    }

    async _addToPanier(produit, qte) {
        let resp = await addToPanier(this.state)
        console.log("panier ==");
        console.log(this.state.panier)
        let ajouter = false;
        if(this.state.panier !== []){
            this.state.panier.forEach(element => {
                if(element.id == produit.id){
                    element.qte = element.qte + qte
                    ajouter = true;
                }
            });
        }

        if(!ajouter){
            id = produit.id;
            var newPanier = this.state.panier.concat({id,qte})
            AsyncStorage.setItem("panier", JSON.stringify(newPanier));
            this.setState({
                panier : newPanier
            });
        }else{
            AsyncStorage.setItem("panier", JSON.stringify(this.state.panier));
        }

        this.setState({loadingPanier: false});
        
    }

    render() {
        let prix = null
        let textPrix
        let textPrixPromo
        let prixReduit

        let currentDate = new Date().getTime()
        let dateDebut = new Date(this.state.produit.prixReduitDu)
        let dateFin = new Date(this.state.produit.prixReduitAu)
        let onTime = ((dateDebut.getTime() < currentDate) & (currentDate < dateFin))


        if(ENV.AFFICHAGE == 1){
            prix = this.state.produit.prix + (this.state.produit.prix * this.state.produit.TVA / 100)
            textPrix = <Text style={styles.prix}>{prix.toFixed(2)+ " TTC"} €</Text>
            prixReduit = this.state.produit.prixReduit + (this.state.produit.prixReduit * this.state.produit.TVA / 100)
            if(onTime){
                textPrix = <Text style={[styles.prix, styles.prixNonPromo]}>{prix.toFixed(2)} €</Text>
                textPrixPromo = <Text style={[styles.prix, styles.prixPromo]}>{prixReduit.toFixed(2)} € TTC</Text>
            }
        }else if(ENV.AFFICHAGE == 2){
            prix = this.state.produit.prix
            textPrix = <Text style={styles.prix}>{prix.toFixed(2)+ " HT"} €</Text>
            prixReduit = this.state.produit.prixReduit
            if(onTime){
                textPrix = <Text style={[styles.prix, styles.prixNonPromo]}>{prix.toFixed(2)} €</Text>
                textPrixPromo = <Text style={[styles.prix, styles.prixPromo]}>{prixReduit.toFixed(2)} € HT</Text>
            }
        }

        let detail = <View></View>
        let styleView = styles.image_container_full

        let buttonAddPanier = (this.state.loadingPanier)?<ActivityIndicator size="large" color={ENV.PRIMARY_COLOR}/>:<Button title="ajouter au panier" onPress={() => {this.setState({loadingPanier:true}); this._addToPanier(this.state.produit, this.state.qte)}}
        />

        if (!this.state.fullscreen) {
            detail = 
            <ScrollView style={styles.details_container}>
                <View style={styles.name_container}>
                    <Text style={styles.name}>{this.state.produit.name}</Text>
                </View>
                <View style={styles.prix_container}>
                    {textPrix}
                    {textPrixPromo}
                </View>
                <View style={styles.ajoutPanier}>
                    <View style={styles.qte}>
                        <Button
                            disabled={this.state.qte <= 1 ? true: false}
                            title="-"
                            onPress={() => this.setQte(this.state.qte-1)}
                        />
                        <TextInput 
                            style={styles.inputQte}
                            keyboardType="numeric"
                            onChangeText={(text) => this.setQte(parseInt(text))}
                        >
                            {this.state.qte}
                        </TextInput>
                        <Button 
                            title="+"
                            onPress={() => this.setQte(this.state.qte+1)}
                        />
                    </View>
                    <View style={styles.buttonAdd}>
                        {buttonAddPanier}
                    </View>

                    
                </View>
                <View style={styles.desc_container}>
                    <Text style={styles.meta}>{this.state.produit.meta.description}</Text>
                </View>
            </ScrollView>
            styleView = styles.image_container

        }

        return (
            <View style={styles.main_container}>
                <View style={styleView}>
                    <ImageSlider
                        images={this.state.produit.img}
                        setImageFullScreen={this.setImageFullScreenFromComp.bind(this)}
                        navigation={this.props.navigation}
                    />
                </View>
                {detail}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    image_container: {
        flex: 1,
        backgroundColor: "white",
        elevation: 0.1,
        maxHeight: 250
    },
    image_container_full: {
        flex: 1,
        backgroundColor: "white",
        elevation: 0.1,

    },
    details_container: {
        flex: 2,
    },
    desc_container: {
        flex: 2,
        margin: 10
    },
    prix_container: {
        flex: 1,
        paddingLeft: 10
    },
    prix: {
        textAlign: 'left',
        fontSize: 25
    },
    prixPromo: {
        color: 'green'
    },
    prixNonPromo: {
        textDecorationLine: 'line-through'
    },
    name: {
        fontSize: 25,
        fontWeight: "bold"
    },
    meta: {
        fontSize: 12,
        textAlign: "left"
    },
    exitIcon: {
        width: 40
    },
    ajoutPanier:{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly"
    },
    inputQte:{
        textAlign: "center",
        height: '100%'
    },
    qte:{
        flexDirection: "row",
        flex: 0.5,
    },
    buttonAdd :{
        width : width*0.7
    }

})

export default ProduitDetail