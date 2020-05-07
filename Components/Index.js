import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator, Platform ,AsyncStorage} from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import ENV from '../environment'
import * as Font from 'expo-font'
import firebase from 'firebase'
import * as Google from 'expo-google-app-auth';


firebase.initializeApp(ENV.firebaseConfig);

class Index extends React.Component {
    connected = false;

    constructor(props) {
        super(props)
        this.state = {
            id : null,
            connected: undefined,
            email: "",
            password: ""
        }
        
    }

    componentDidMount() {
        Font.loadAsync({
          'pacifico': require('../assets/fonts/Pacifico.ttf'),
          'josefin': require('../assets/fonts/Josefin.ttf')
        });
        this.checkIfLoggedIn()
      }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                this.props.navigation.replace("Catalogue")
            }else{
                this.props.navigation.replace("Login")
            }
            }.bind(this)
        )
    }
    
    checkConnectivity = () => {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
          });
          connected = true;
    }

    async _loadId(){
        try{
            var idStored = await AsyncStorage.getItem("id");
            if(this.state.statut){
                this.props.navigation.replace("Catalogue")
            }
        }catch(e){
            console.log(e);
        }
    }

    loginUser = () => {
        try {
            firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
            .then( async function (result){
                        await AsyncStorage.setItem("id",result.user.uid)
                        firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .once('value')
                        .then(async function(snapchot){
                            console.log(snapchot.val())
                            await AsyncStorage.setItem("prenom",snapchot.val()['first_name']);
                            await AsyncStorage.setItem("nom",snapchot.val()['last_name']);
                            await AsyncStorage.setItem("email",snapchot.val()['mail']);
                            await AsyncStorage.setItem("tel",snapchot.val()['tel']);
                        })
                    }.bind(this))
        } catch (error) {
            console.log(error)   
        }
        

    }

    connectivityOnscreen(){
        
            this.connected = false
            return(
                <View>
                    <Text> Not connected</Text>
                    <Button 
                        title="Retry"
                        color={ENV.PRIMARY_COLOR}
                        onPress={() => this.setState({connected:undefined})}
                    />
                </View>
            )
        
    }


    signInWithGoogleAsync = async () =>{
        try {
        const result = await Google.logInAsync({
            androidClientId: ********************,
            //iosClientId: YOUR_CLIENT_ID_HERE,
            scopes: ['profile', 'email'],
        });
    
        if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
        } catch (e) {
        return { error: true };
        }
    }

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
            .then(function(result){
                console.log("user signed in", result.additionalUserInfo);
                if(result.additionalUserInfo.isNewUser){
                    firebase
                    .database()
                    .ref('/users/' + result.user.uid)
                    .set({
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        locale: result.additionalUserInfo.profile.locale,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        create_at:Date.now()
                    }).then(function(snapchot){
                        console.log('Snapshot',snapchot)
                    })
                }else{
                    firebase
                    .database()
                    .ref('/users/' + result.user.uid).update({
                        last_logged_in:Date.now()
                    })
                }
                
            })
            
            
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this));
      }

    isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
            // We don't need to reauth the Firebase connection.
            return true;
        }
        }
    }
        return false;
    }

    render() {
        this.checkConnectivity()
        this._loadId()
        return (
                <View style={styles.main_container}>
                    {this.connectivityOnscreen()}
                </View>
            )
    }}

    const styles = StyleSheet.create({
    main_container: {
    flex: 1
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },  
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      },
      topContainer:{
          flex: 1
      },
      textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    })

export default Index
