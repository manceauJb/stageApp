import React from 'react'
import { StyleSheet, View, Image, Text, Dimensions, ImageBackground } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { checkVerify, loadCatalogue } from '../API/Api'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Font from 'expo-font';


const { width, height } = Dimensions.get('window');



class ProduitItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            preview: true
        }
    }

    render(){
        const { produit, vp ,_produitToScreen} = this.props

        let prix = null
        let textPrix = null
        let produitPrixContainer = styles.produitPrix
        let textPrixPromo
        let prixReduit

        if(ENV.AFFICHAGE == 1){
            prix = produit.prix + (produit.prix * produit.TVA / 100)
            textPrix = <Text style={styles.produitPrix}>{prix.toFixed(2)} €</Text>
            prixReduit = produit.prixReduit + (produit.prixReduit * produit.TVA / 100)
        }else if(ENV.AFFICHAGE == 2){
            prix = produit.prix
            textPrix = <Text style={styles.produitPrix}>{prix.toFixed(2)} €</Text>
            prixReduit = produit.prixReduit
        }

        

        let currentDate = new Date().getTime()
        let dateDebut = new Date(produit.prixReduitDu)
        let dateFin = new Date(produit.prixReduitAu)
        let onTime = ((dateDebut.getTime() < currentDate) & (currentDate < dateFin))
        if(onTime){
            
            textPrix = <Text style={[styles.produitNonReduit]}>{prix.toFixed(2)} €</Text>
            textPrixPromo = <Text style={[styles.produitReduit, {color: ENV.PRIMARY_COLOR}]}>{prixReduit.toFixed(2)} €</Text>
            produitPrixContainer = [styles.produitPrix,{flex: 2}]
        }
            return( 
                <TouchableOpacity 
                    style={styles.touchable}
                    activeOpacity={0.5}
                    onPress={() =>_produitToScreen(produit)}
                >
                    <Image 
                        source={{uri:produit.img[0], cache:"force-cache"}}
                        style={styles.produitImg}
                    />
                    <View style={styles.desc}>
                        <Text style={styles.produitName}>{produit.titre}</Text>
                        <View style={produitPrixContainer}>
                            {textPrix}
                            {textPrixPromo}
                        </View>
                        <View style={styles.produitMeta}>
                            <Text style={styles.produitDesc}
                            numberOfLines={6}>
                                {produit.meta.description}
                            </Text>
                        </View>
                    </View>
                    
                    
                </TouchableOpacity>
            )
    }

}

const styles = StyleSheet.create({
    touchable:{
        flex: 1,
        height: 300,
        width: (width/2),
        padding: 20,
        backgroundColor: "white",
        marginBottom:1,
        marginHorizontal:0.5
    },
    produitImg:{
        flex: 3,
        resizeMode: "center",
        maxHeight: 200,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    produitName: {
        flex: 1,
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
    },
    produitInfo:{
        flex:2
    },
    produitPrix:{
        flex:1,
        textAlign: 'center',
        fontSize: 18,
    },
    produitNonReduit:{
        marginTop: 2,
        flex:1,
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: "line-through"
    },
    produitReduit:{
        flex:2,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: "bold"
    },
    produitDispo:{
        flex:2,
        color:'green',
        fontSize: 16
    },
    produitNonDispo:{
        flex:2,
        color:'red',
        fontSize: 16
    },
    desc:{
        flex:5,
    },
    produitMeta:{
        flex: 3,
        
    },
    produitDesc:{
        fontSize: 12,
        color: "grey",
        textAlign: 'center'
    }

})


export default ProduitItem
