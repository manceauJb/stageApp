import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator, Platform, CheckBox, AsyncStorage } from 'react-native'
import ENV from '../environment'
import Toast from 'react-native-tiny-toast'
import { sendVerifiedCode, resendCode, editMailTel } from '../API/Api'
import Dialog from "react-native-dialog";

class Verification extends React.Component{

    constructor(props){
        super(props)
        let params = this.props.navigation.state.params;
        this.state = {
            id: params.id,
            email: params.email,
            emailVerified: params.emailVerified,
            tel: params.tel,
            telVerified: params.telVerified,
            emailCode: "",
            telCode: "",
            validEmailCode:true,
            validTelCode: true,
            dialogMailVisible: false,
            dialogTelVisible: false,
            dialogEditMailVisible: false,
            dialogEditTelVisible: false,
            tmpEmail: "",
            tmpTel: "",
            dialogValidEmail: true,
            dialogValidTel: true,
            updateValid: params.update
        }
        
    }

    checkContent(){
        let paternCode = new RegExp('^[0-9]{6}$')
        let resultMail = false;
        let resultTel = false;
        
        let tmpValidEmailCode = true;
        let tmpValidTelCode = true;
        if((paternCode.test(this.state.emailCode) & !this.state.emailVerified) | (this.state.emailVerified)){
            resultMail = true;
        }else{
            tmpValidEmailCode = false
        }
        if((paternCode.test(this.state.telCode) & !this.state.telVerified) | (this.state.telVerified)){
            resultTel = true;
        }else{
            tmpValidTelCode = false;
        }

        if(this.state.validEmailCode !== tmpValidEmailCode | this.state.validTelCode !== tmpValidTelCode){
            this.setState({
                validTelCode: tmpValidTelCode,
                validEmailCode: tmpValidEmailCode
            })  
        }
        console.log("sesult bool " + (resultMail & resultTel));
        
        return (resultMail & resultTel)

        
    }

    async buildRequestSendCode(){
        let resp = sendVerifiedCode(this.state);

        if(resp.success){
            if(resp.data.verified){
                Toast.showSuccess("Vérified");
                this.props.navigation.navigate("Catalogue",{verified:true, mailVerified: resp.data.email, telVerified: resp.data.tel});
            }else{
                console.log("here")
                this.state.updateValid(resp.data.tel,resp.data.email)
                this.setState({
                    validTelCode: resp.data.tel,
                    telVerified: resp.data.tel,
                    validEmailCode: resp.data.email,
                    emailVerified: resp.data.email,
                })
            }
        } else {
            console.log("fail");
            console.log(resp.error.code);
            Toast.show("Err "+ resp.error.code + ": "  + resp.error.desc);
        }
    }

    async buildRequestResendCodeMail(){
        let data = {id:this.state.id,emailResend: true, email: this.state.email}
        let resp = resendCode(data)
        if(resp.success){
            if(resp.data.resend){
                Toast.showSuccess("Mail envoyé")
            }
        }else{
            console.log("fail");
            console.log(resp.error.code);
            Toast.show("Err "+ resp.error.code + ": "  + resp.error.desc);
        }
    }

    async buildRequestResendCodeTel(){
        let data = {id: this.state.id,telResend: true, tel: this.state.tel}
        let resp = resendCode(data)
        if(resp.success){
            if(resp.data.resend){
                Toast.showSuccess("SMS envoyé")
            }
        }else{
            console.log("fail");
            console.log(resp.error.code);
            Toast.show("Err "+ resp.error.code + ": "  + resp.error.desc);
        }
    }

    cancelDialog = () => {
        this.setState({
            dialogMailVisible: false,
            dialogTelVisible: false
        })
    }

    resendMail = () => {
        this.buildRequestResendCodeMail();
        this.cancelDialog();
    }

    resendSMS = () => {
        this.buildRequestResendCodeTel();
        this.cancelDialog();
    }

    async editMail(){
        let paternMail = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$')
        if(paternMail.test(this.state.tmpEmail)){
            let resp = editMailTel({id: this.state.id, emailEdit: true, email: this.state.tmpEmail})
            if(resp.success){
                if(resp.data.edited){
                    await AsyncStorage.setItem("email",this.state.tmpEmail);
                    this.setState({dialogEditMailVisible: false, email: this.state.tmpEmail, tmpEmail: "", dialogValidEmail: true})
                }else{
                    /// adresse mail pas modifier pas l'API 
                }
            }else{
                console.log("fail");
                console.log(resp.error.code);
                Toast.show("Err "+ resp.error.code + ": "  + resp.error.desc);
            }
        }else{
            /// Ce n'est pas une adresse mail
            Toast.show("Ce n'est pas une adresse Email.")
            this.setState({dialogValidEmail: false})
        }
    }

    async editTel(){
        let paternTel = new RegExp('^[0-9]{10}$')
        if(paternTel.test(this.state.tmpTel) | this.state.tmpTel!==""){
            let resp = editMailTel({id: this.state.id, telEdit: true, tel: this.state.tmpTel})
            if(resp.success){
                if(resp.data.edited){
                    await AsyncStorage.setItem("tel",this.state.tmpTel);
                    this.setState({dialogEditTelVisible: false, tel: this.state.tmpTel, tmpTel: "", dialogValidTel: true})
                }else{
                    /// adresse mail pas modifier pas l'API 
                }
            }else{
                console.log("fail");
                console.log(resp.error.code);
                Toast.show("Err "+ resp.error.code + ": "  + resp.error.desc);
            }
        }else{
            /// Ce n'est pas une adresse mail
            Toast.show("Ce n'est pas un numéro de Tel.")
            this.setState({dialogValidTel: false})
        }
    }



    emailVerifRender(){
        if(this.state.emailVerified){
            return(
                <View>
                    <Text style={styles.verifiedText}>
                        Email verified
                    </Text>
                </View>
            )
        }else{
            let Inputstyle = styles.textinput
            if(!this.state.validEmailCode){
                Inputstyle = styles.textinputred
            }

            let EditInputStyle = styles.textinput
            if(!this.state.dialogValidEmail){
                EditInputStyle = styles.textinputred
            }

            return(
                <View >
                        <Text>Code envoyé par email :</Text>
                        <TextInput
                            style={Inputstyle}
                            placeholder="Code envoyé par mail."
                            keyboardType="numeric"
                            onChangeText={(text) => this.setState({emailCode:text})}
                            onSubmitEditing={(text) => {
                                if(this.secondInput !== undefined){
                                    this.secondInput.focus()
                                }
                                
                            }}
                        />
                        <Text style={styles.hyperlinktext} onPress={() => this.setState({dialogMailVisible: true})}>
                            Je n'es pas reçu de mail.
                        </Text>
                        <View>
                            <Dialog.Container visible={this.state.dialogMailVisible}>
                                <Dialog.Title>Renvoyer un Email ?</Dialog.Title>
                                <Dialog.Description>
                                    {"Voulez-vous recevoir un autre code à cette adresse:  " + this.state.email}
                                </Dialog.Description>
                                <Dialog.Button label="Non merci" onPress={() => this.cancelDialog()}/>
                                <Dialog.Button label="Mauvais adresse mail" onPress={() => {this.setState({dialogEditMailVisible: true})}}/>
                                <Dialog.Button label="Oui" onPress={() => this.resendMail()}/>
                                
                            </Dialog.Container>
                        </View>
                        <View>
                            <Dialog.Container visible={this.state.dialogEditMailVisible}>
                                <Dialog.Title>Changer d'adresse Email</Dialog.Title>
                                <Dialog.Description>
                                    {"Entrez votre nouvelle adresse Email :"}
                                </Dialog.Description>
                                <Dialog.Input 
                                    label="Email" 
                                    style={EditInputStyle}
                                    placeholder="Nouvelle adresse Email."
                                    keyboardType="email-address"
                                    onChangeText={(text) => this.setState({tmpEmail: text})}
                                    onSubmitEditing={() => this.editMail()}
                                />
                                <Dialog.Button label="Annuler" onPress={() => this.setState({dialogEditMailVisible: false, tmpEmail: "", dialogValidEmail: true})}/>
                                <Dialog.Button label="Changer" onPress={() => { this.editMail()}}/>
                                
                            </Dialog.Container>
                        </View>
                </View>
            )
        }
    }

    telVerifRender(){
        if(this.state.telVerified){
            return(
                <View>
                    <Text style={styles.verifiedText}>
                        Numéro verifié
                    </Text>
                </View>
            )
        }else{
            let Inputstyle = styles.textinput
            if(!this.state.validTelCode){
                Inputstyle = styles.textinputred
            }

            let EditInputStyle = styles.textinput
            if(!this.state.dialogValidTel){
                EditInputStyle = styles.textinputred
            }
            return(
                <View >
                    <Text>Code envoyé par SMS :</Text>
                    <TextInput
                        ref={(input) => this.secondInput = input }
                        style={Inputstyle}
                        placeholder="Code envoyé par SMS."
                        keyboardType="numeric"
                        onChangeText={(text) => this.setState({telCode:text})}
                    />
                    <Text style={styles.hyperlinktext} onPress={() => this.setState({dialogTelVisible: true})}>
                            Je n'es pas reçu de SMS.
                    </Text>
                    <View>
                        <Dialog.Container visible={this.state.dialogTelVisible}>
                            <Dialog.Title>Renvoyer un SMS ?</Dialog.Title>
                            <Dialog.Description>
                                {"Voulez-vous recevoir un autre code à ce numéro: " + this.state.tel}
                            </Dialog.Description>
                            <Dialog.Button label="Non merci" onPress={() => this.cancelDialog()}/>
                            <Dialog.Button label="Mauvais numéro" onPress={() => {this.setState({dialogEditTelVisible: true})}}/>
                            <Dialog.Button label="Oui" onPress={() => this.resendSMS()}/>
                        </Dialog.Container>
                    </View>
                    <View>
                            <Dialog.Container visible={this.state.dialogEditTelVisible}>
                                <Dialog.Title>Changer de numéro de Tel</Dialog.Title>
                                <Dialog.Description>
                                    {"Entrez votre numéro :"}
                                </Dialog.Description>
                                <Dialog.Input 
                                    label="Téléphone" 
                                    style={EditInputStyle}
                                    placeholder="Nouveau numéro de téléphone."
                                    keyboardType="numeric"
                                    onChangeText={(text) => this.setState({tmpTel: text})}
                                    onSubmitEditing={() => this.editTel()}
                                />
                                <Dialog.Button label="Annuler" onPress={() => this.setState({dialogEditTelVisible: false, tmpTel: "", dialogValidTel: true})}/>
                                <Dialog.Button label="Changer" onPress={() => { this.editTel()}}/>
                                
                            </Dialog.Container>
                        </View>
                </View>
            )
        }
    }

    render(){
        return(
            <View>
                {this.emailVerifRender()}
                {this.telVerifRender()}
                <Button 
                    title="Vérifier"
                    color={ENV.PRIMARY_COLOR}
                    onPress={() => {
                        if(this.checkContent()){
                            this.buildRequestSendCode()
                        }
                    }
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    textinputred:{
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: 'red',
        borderWidth: 1,
        paddingLeft: 5
    },
    verifiedText:{
        color: 'green',
        fontSize: 20
    },
    hyperlinktext:{
        color: 'blue',
        fontStyle : 'italic',
        textDecorationLine : "underline"
    },
    hyperlink:{
        height: 30
    }
})


export default Verification