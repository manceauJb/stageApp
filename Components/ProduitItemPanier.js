import React from 'react'
import { StyleSheet, View, Image, Text, Dimensions, ImageBackground, Button } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { checkVerify, loadCatalogue } from '../API/Api'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons'


const { width, height } = Dimensions.get('window');



class ProduitItemPanier extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            preview: true
        }
    }

    render(){
        const { produit, qte, moinsProduit, plusProduit , removeProduit} = this.props

        let prix = null
        let textPrix = null
        let prixReduit
        let textTotal

        let currentDate = new Date().getTime()
        let dateDebut = new Date(produit.prixReduitDu)
        let dateFin = new Date(produit.prixReduitAu)
        let onTime = ((dateDebut.getTime() < currentDate) & (currentDate < dateFin))
        

        if(ENV.AFFICHAGE == 1){
            prix = produit.prix + (produit.prix * produit.TVA / 100)
            prixReduit = produit.prixReduit + (produit.prixReduit * produit.TVA / 100)
            if(onTime){
                prix = prixReduit
            }
            textPrix = <Text style={styles.produitPrix}>{prix.toFixed(2)} €</Text>
            textTotal = <Text style={[styles.produitPrix,{ textAlign:  'right'}]}>{(prix * qte).toFixed(2)} € TTC</Text>
        }else if(ENV.AFFICHAGE == 2){
            prix = produit.prix
            prixReduit = produit.prixReduit
            if(onTime){
                prix = prixReduit
            }
            textPrix = <Text style={styles.produitPrix}>{prix.toFixed(2)} €</Text>
            textTotal = <Text style={[styles.produitPrix,{ textAlign:  'right'}]}>{(prix * qte).toFixed(2)} € HT</Text>
        }

        

        
            return( 
                <View 
                    style={styles.container}
                >
                    <View style={styles.leftContainer}>
                    <Text style={styles.produitName}>{produit.titre}</Text>
                        <Image 
                            source={{uri:produit.img[0], cache:"force-cache"}}
                            style={styles.produitImg}
                        />
                    </View>
                    
                    <View style={styles.rightContainer}>
                        <View style={styles.info}>
                            <View style={styles.prixContainer}>
                                {textPrix}
                            </View>
                            <View style={styles.qte}>
                                <Text style={[styles.produitPrix,{ textAlign: "left"}]}>{ " x " +  qte}</Text>
                            </View>
                            <View style={styles.totalProduit}>
                                {textTotal}
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonMP}>
                                <TouchableOpacity 
                                    style={{width: 35,height: 35, justifyContent: "center", alignItems: "center"}}
                                    onPress={() => moinsProduit(produit)}>
                                    <Text style={styles.MPtext}>-</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{width: 35,height: 35, justifyContent: "center", alignItems: "center"}}
                                    onPress={() => plusProduit(produit)}>
                                    <Text style={styles.MPtext}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonD}>
                            <TouchableOpacity 
                                style={{width: 35,height: 35, justifyContent: "center", alignItems: "center"}}
                                onPress={() => removeProduit(produit)}>
                                <Icon
                                    name="md-trash"
                                    color='grey'
                                    size={30}>
                                </Icon> 
                            </TouchableOpacity>
                            
                            </View>
                        </View>
                    </View>
                    
                    
                </View>
            )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        height: 150,
        width: (width),
        padding: 20,
        backgroundColor: "white",
        marginBottom:1,
        marginHorizontal:0.5,
        flexDirection:"row"
    },
    produitImg:{
        flex: 2,
        resizeMode: "center",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    produitName: {
        flex: 1,
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
    },
    prixContainer:{
        flex: 1,
    },
    produitPrix:{
        flex:1,
        textAlign: 'center',
        fontSize: 18,
        textAlignVertical: "center",
    },
    totalProduit:{
        flex: 1
    },
    qte:{
        flex: 1,
        justifyContent: "center",
        height: "100%",
        textAlignVertical: "center",
    },
    leftContainer:{
        flex: 4
    },
    info:{
        flex: 1,
        flexDirection : "row"
    },
    rightContainer:{
        flex:6,
    },
    buttonContainer:{
        flex: 0.5,
        flexDirection: "row",
        width: "100%",
        
    },
    buttonMP:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    buttonD:{
        flex: 1,
        alignItems: "flex-end"
    },
    MPtext:{
        fontSize: 30,
        color: 'grey'
    }
})


export default ProduitItemPanier
