import React from 'react'
import { StyleSheet, View, Image, Text, Dimensions, ImageBackground } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { checkVerify, loadCatalogue } from '../API/Api'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Font from 'expo-font';


const { width, height } = Dimensions.get('window');



class CategorieItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            preview: true
        }
    }

    render(){
        const { cat, _setOnScreen, produits, sousCategorie} = this.props
        if(this.state.preview){
            return(
                <TouchableOpacity 
                    style={styles.touchable}
                    activeOpacity={0.5}
                    onPress={() => _setOnScreen(cat,false, produits,sousCategorie)}>
                    <ImageBackground
                        style={styles.imagesBox}
                        imageStyle={styles.image}
                        source={{uri:cat.img}}>
                        <View style={styles.view}>
                            <Text style={styles.title}>{cat.name}</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            )
        }else{
            return(<Text>noting</Text>)
        }
    }



}

const styles = StyleSheet.create({
    touchable:{
        marginBottom: 10,
        backgroundColor: 'transparent',
        borderRadius: 20,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        alignItems:"center",
        justifyContent:'center',
        fontSize: 30,
        fontFamily: 'pacifico'
    },
    view:{
        alignItems:"center",
        justifyContent:'center',
        height: '100%',
        width: '100%',
    },
    imagesBox:{
        height: '100%',
        width: '100%',
    },
    image:{
        opacity:0.7,
        borderRadius:20
    }
})

export default CategorieItem