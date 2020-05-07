import React from 'react'
import { StyleSheet, View, Image, Text, Dimensions, ImageBackground } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/Ionicons'
import { checkVerify, loadCatalogue } from '../API/Api'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Font from 'expo-font';
import moment from "moment"
import CountDown from 'react-native-countdown-component';


const { width, height } = Dimensions.get('window');



class VentePriveeItem extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const { vpItem, verification, _setOnScreen, check, produits, sousCategorie } = this.props
        let localVerif = 0; 

        let niveauRequis = vpItem.bitfield
        
        if((verification.telVerif & !verification.mailVerif)){
            localVerif = 5
        }else if(!verification.telVerif & verification.mailVerif){
            localVerif = 6
        }else if(verification.telVerif & verification.mailVerif){
            localVerif = 7
        }

        console.log("local "+localVerif +" requis " + niveauRequis)
        let ACCESS = (localVerif & niveauRequis) == niveauRequis
        console.log(ACCESS)

        let currentDate = new Date().getTime()
        let cadenas
        let filtreImage
        let dateDebut = new Date(vpItem.debut)
        let dateFin = new Date(vpItem.fin)
        let onTime = ((dateDebut.getTime() < currentDate) & (currentDate < dateFin))
        let countdown

        if(!ACCESS){
            cadenas = <Icon name="md-lock" size={50}/>
            filtreImage = styles.imageVPLock
        }else if ( !onTime ){
            cadenas = <Text style={styles.dateVP}>{moment(dateDebut).format("DD/MM")+ " - " + moment(dateFin).format("DD/MM")}</Text>
            filtreImage = styles.imageVPNotOnTime
        }else{
            let difference_ms = dateFin.getTime()-currentDate
            let difference_seconds = difference_ms/1000

            filtreImage = styles.imageVP
            cadenas = <Text  style={styles.dateVPFin}>Ce fini dans :</Text>
            countdown = <CountDown 
                        until={difference_seconds}
                        size={20}
                        digitStyle={{backgroundColor: '#FFF', borderWidth:2}}
                        timeLabelStyle={{fontSize:12,color:"#000",fontWeight:"bold"}}
                        timeLabels={{d:"J",h:"H",m: "M", s: "S"}}
                        
                    />
        }
        try{
            if(vpItem !== null){
                return(
                <TouchableOpacity 
                    style={styles.touchVP}
                    activeOpacity={0.5}
                    onPress={() => {
                        if(!ACCESS){
                            check()
                        }else if(!onTime){
                            if(currentDate > dateFin){
                                Toast.show("Vous arrivez trop tard")
                            }else{
                                Toast.show("Cette vente commence le "+moment(dateDebut).format("DD/MM"))
                            }
                        }else{
                            _setOnScreen(vpItem,true,produits, sousCategorie)
                        }}}
                    key={vpItem.id}>
                    
                    <ImageBackground
                        style={styles.imagesBoxVP}
                        imageStyle={styles.imageVP,filtreImage}
                        source={{uri:vpItem.img}}>
                        
                        <View style={styles.viewVP}>
                            <Text style={styles.textVP}>{vpItem.name}</Text>
                        </View>
                        <View style={styles.iconVP}>
                            {cadenas}
                            {countdown}
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
                )
            }
        }catch(e){
            console.log(e);   
        }
    
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
        fontWeight: 'bold',
        fontFamily: 'josefin'
    },
    dateVPFin:{
        fontSize: 20,
        marginBottom:5,
        fontWeight: "bold",
        fontFamily: 'josefin',
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
    }
})

export default VentePriveeItem