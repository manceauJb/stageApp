import React from 'react'
import { StyleSheet,KeyboardAvoidingView, View, TextInput,Dimensions, Button, Text, FlatList, ActivityIndicator, Platform, CheckBox ,AsyncStorage} from 'react-native'
import ENV from '../environment'
import {loadCommandes, loadCatalogue} from "../API/Api"
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/Ionicons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'



const { width, height } = Dimensions.get('window');

class MesCommandes extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id: this.props.navigation.state.params.id,

            loading : true,
            
            listCommandes: []
        }
    }

    componentDidMount(){
        this.loadCommandes();
    }
    
    async loadCommandes(){
        let resp = await loadCommandes({id:this.state.id});

        if(resp.success){
            console.log(resp.data);
            this.setState({
                loading: false,
                listCommandes: resp.data.commandes
            })
        }
    }

    renderCommande(item){
        return(
            <View>
                <Text>Commande n°{item.id}</Text>
            </View>
        )

    }

    renderListCommandes(){
        return(
            <View>
                <FlatList 
                    data={this.state.listCommandes}
                    keyExtractor={(item) =>item.id.toString()}
                    renderItem={({item}) => this.renderCommande(item)}
                    ListEmptyComponent={<Text>TO DO </Text>}
                />
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
            return(this.renderListCommandes());
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

export default MesCommandes
