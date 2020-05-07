import React from 'react'
import { Animated, StyleSheet, View, Image, Text, Dimensions, AsyncStorage, Button, ScrollView, FlatList } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { loadPanier, addQtePanier, subQtePanier, removePanier, validationPanier } from '../API/Api'
import ImageSlider from './ImageSlider'
import ProduitItemPanier from './ProduitItemPanier'

class Panier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.navigation.state.params.id,
            panier: null,
            prixHT: 0,
            prixTVA: 0
        }
    }

    componentDidMount(){
        this.loadPanier();
    }


    async loadPanier() {
        let resp = await loadPanier(this.state)

        if(resp.success){
            var catalogueStored = await AsyncStorage.getItem("catalogue");
            var listeProduits = JSON.parse(catalogueStored).produits;
           
            let listeProduitsPanier = [];
            
            let panier = resp.data['produits']
            console.log(listeProduits)
            if(panier != undefined && (panier.length) !== 0){
                panier.forEach(element => {
                    produit = listeProduits.find( produit => produit.id == parseInt(element.id));
                    qte = element.qte;
                    listeProduitsPanier.push({produit, qte});
                });
                this.setState({panier: listeProduitsPanier, prixHT: resp.data['total'].totalHT, prixTVA: resp.data['total'].totalTVA, prixTTC: resp.data['total'].totalTTC })
            }else{
                let panier = [];
                await AsyncStorage.setItem("panier", JSON.stringify(panier));
                this.setState({panier: [], prixHT: 0, prixTVA: 0})
            }
        }
    }

    async clearPanier() {
        let panier = []
        await AsyncStorage.setItem("panier", JSON.stringify(panier));
        this.setState({panier: panier})
    }

    async validationPanier() {
        console.log("Validation")
        let resp = await validationPanier({id:this.state.id})
        if(resp.success){
            console.log(resp.data);
            this.props.navigation.navigate("Transport", {prixHT: this.state.prixHT, prixTVA: this.state.prixTVA});
        }
        // Condition panier valide 
        // Alors :
        
    }

    async moinsProduit(produit){
        console.log(produit);
        let resp = await subQtePanier({id:this.state.id,idproduit:produit.id})
        this.loadPanier();
    }

    async plusProduit(produit){
        console.log(produit);
        let resp = await addQtePanier({id:this.state.id,idproduit:produit.id})
        this.loadPanier();
    }

    async removeProduit(produit){
        console.log(produit);
        let resp = await removePanier({id:this.state.id,idproduit:produit.id})
        this.loadPanier();
    }

    render() {
        return(
            <View style={styles.main_container}>
                <Button 
                    title={"Vider mon panier"}
                    color={'#c7c7c7'}
                    onPress={() => this.clearPanier()}
                />
                <FlatList 
                    data={this.state.panier}
                    keyExtractor={(item) =>item.produit.id.toString()}
                    renderItem={({item}) => <ProduitItemPanier produit={item.produit} qte={item.qte} moinsProduit={this.moinsProduit.bind(this)} plusProduit={this.plusProduit.bind(this)} removeProduit={this.removeProduit.bind(this)}/>}
                    ListEmptyComponent={<Text>TO DO </Text>}
                />
                <View style={styles.recapContainer}>
                    <Text style={styles.prixHT}>{this.state.prixHT.toFixed(2)} HT</Text>
                    <Text style={styles.prixTVA}>{this.state.prixTVA.toFixed(2)} de TVA</Text>
                    <Text style={styles.prixTTC}>{(this.state.prixHT+ this.state.prixTVA).toFixed(2)} TTC</Text>
                </View>
                <Button 
                    title={"Valider mon panier"}
                    color={ENV.PRIMARY_COLOR}
                    onPress={() => this.validationPanier()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    recapContainer:{
        flexDirection : "column"
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

export default Panier