import React from 'react'
import { StyleSheet,KeyboardAvoidingView, View, TextInput,Dimensions, Button, Text, FlatList, ActivityIndicator, Platform, CheckBox ,AsyncStorage} from 'react-native'
import ENV from '../environment'
import {getIdFromRegistration} from "../API/Api"
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/Ionicons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'



const { width, height } = Dimensions.get('window');

class AttentePaiement extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading : true,

            id: this.props.navigation.state.params.id,
            type: this.props.navigation.state.params.type,
            titre : this.props.navigation.state.params.titre,
            data : this.props.navigation.state.params.data,

            //Cheque        type=1
            montant: null,
            beneficiaire: null,
            adresse: null,
            
            // Virement     type=2
            message : null,

        }
    }

    componentDidMount(){
        this.formatData()
    }

    formatData(){
        if(this.state.loading){
            switch (this.state.type) {
                case 1:
                    // Cheque
                    this.setState({
                        loading: false,
                        montant: this.state.data.montant,
                        beneficiaire: this.state.data.beneficiaire,
                        adresse: this.state.data.adresse
                    })
                    break;
                case 2:
                    // Virement
                    this.setState({
                        loading: false,
                        message: this.state.data.message
                    })
                    break;
                default:
                    break;
            }
        }
    }

    renderVirement(){
        return(
            <View>
                <Text>
                    {this.state.message}
                </Text>
            </View>
        )
    }

    renderCheque(){
        return(
            <View>
                <Text>
                    Veuillez nous envoyer votre chèque en suivant ces indications : 
                </Text>
                <Text>Montant :{this.state.montant.toFixed(2)} €</Text>
                <Text>Bénéficiaire :{this.state.beneficiaire}</Text>
                <Text>Envoyez votre chèque à cette adresse :{this.state.adresse}</Text>
            </View>
        )
    }


    render(){
        if(this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: "center",}}>
                    <ActivityIndicator
                        color={ENV.PRIMARY_COLOR} 
                        size='large'/>
                </View>
            )
        }else{
            switch (this.state.type) {
                case 1:
                    // Cheque
                    return(this.renderCheque());
                    break;
                case 2:
                    // Virement
                    return(this.renderVirement());
                    break;
            
                default:
                    break;
            }
        }
        
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
        marginTop: 15
    },
    icon_save:{
        width: width*0.15,
        height:  width*0.15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 20,
        borderColor: ENV.PRIMARY_COLOR
    }
})

export default AttentePaiement
