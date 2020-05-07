import React from 'react'
import {Animated, StyleSheet, View, Image, Text, Dimensions, AsyncStorage, Button, ScrollView, FlatList, ListView} from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ProduitItem from './ProduitItem'
import Icon from 'react-native-vector-icons/Ionicons'

const { width, height } = Dimensions.get('window');

class CategorieDetail extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id: this.props.navigation.state.params.id,
            catInfo: this.props.navigation.state.params.catInfo,
            vp: this.props.navigation.state.params.vp,
            produits: this.props.navigation.state.params.produits,
            produitsList: this.props.navigation.state.params.produits,
            sousCategorie: this.props.navigation.state.params.sousCategorie,
            produitsLoaded: false,
            refreshProduits: false,
            scollY: new Animated.Value(0),
            sousCategorieSelected: this.props.navigation.state.params.sousCategorie[0]
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
          title: params ? params.screenTitle: 'Catégorie',
          headerRight: () =>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity
                    style={styles.panierIcon}
                    onPress={() => params.function()}>
                    <Icon
                        name="md-cart"
                        size={30}>
                    </Icon>
                </TouchableOpacity>
            </View>  
        }
      };

    componentDidMount(){
        this.loadPanier()
        this.props.navigation.setParams({screenTitle:this.state.catInfo.name + " ", function: this.goToPanier.bind(this)})
    }


    _produitToScreen = (produitScreen) =>{
        this.props.navigation.navigate("ProduitDetail",{produit : produitScreen, vp: this.state.vp, id: this.state.id})
    }

    _renderCatImage(){
        const headerHeight = this.state.scollY.interpolate({
            inputRange:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150],
            outputRange:[150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]
        })
        console.log(headerHeight)
        return(
            <Animated.View >
                <Animated.Image source={{uri:this.state.catInfo.img}} style={[styles.imgCat,{height: headerHeight}]}/>
            </Animated.View>
        )
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

    _renderSubCatSeparator = () =>{
        return(
            <View style={{
                borderRightColor:"grey",
                borderRightWidth: 1,
                marginVertical: 5
            }}/>
        )
    }

    goToPanier(){
        console.log("panier");
        this.props.navigation.navigate("Panier",{id:this.state.id})
    }

    filtreListe(){
        let newListe = [];
        if(this.state.sousCategorieSelected.id !== 0){
            this.state.produitsList.forEach(produit => {
                if(produit.sousCategorie.includes(this.state.sousCategorieSelected.slug)){
                    newListe.push(produit);
                }
            });
            return newListe;
        }else{
            return this.state.produitsList
        }
    }


    render(){
        return(
            <FlatList
                    style={styles.flatist}
                    data={this.filtreListe()}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <ProduitItem produit={item} vp={this.state.vp} _produitToScreen={this._produitToScreen}/>}
                    numColumns={2}
                    ListHeaderComponent={
                        <Animated.View>
                            {this._renderCatImage()}
                           <FlatList
                            horizontal
                            data={this.state.sousCategorie}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => 
                                <TouchableOpacity
                                    style={{height:"100%", justifyContent:"center"}}
                                    onPress={() => this.setState({sousCategorieSelected: item})}>
                                        <Text style={[{width: width/4,fontSize:16, textAlign:"center",textAlignVertical:"center"},(item.slug === this.state.sousCategorieSelected.slug) ? {fontWeight: "bold"} : {fontWeight:"normal"}]}>{item.name}</Text>
                                </TouchableOpacity>}
                            style={styles.subCatList}
                            scrollEventThrottle={1}
                            ItemSeparatorComponent = {this._renderSubCatSeparator}
                            showsHorizontalScrollIndicator={false}
                        /> 
                        </Animated.View>
                        }
                    stickyHeaderIndices={[0]}
                    onScroll={Animated.event(
                        [{nativeEvent: { contentOffset: {y : this.state.scollY}}}]
                    )}
                    scrollEventThrottle={1}
                />
        )
    }
}

const styles = StyleSheet.create({
    imgCat:{
        opacity: 0.98,
        marginBottom: 0
    },
    subCatList:{
        width:"100%",
        height:50,
        backgroundColor:"#f2f2f2",
        elevation: 1
    },
    panierIcon: {
        width: 40
    }
})

export default CategorieDetail