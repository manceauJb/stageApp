// Navigation/Navigation.js
import React from 'react'
import { Image, Text } from 'react-native'
import { createStackNavigator, TransitionPresets} from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import Index from '../Components/Index'
import Inscription from '../Components/Inscription'
import Catalogue from '../Components/Catalogue'
import Verification from '../Components/Verification'
import CategorieDetail from '../Components/CategorieDetail'
import ProduitDetail from '../Components/ProduitDetail'
import Panier from '../Components/Panier'
import Transport from '../Components/Transport'
import InfoPerso from '../Components/InfoPerso'
import Account from '../Components/Account'
import MesCommandes from '../Components/MesCommandes'
import Paiement from '../Components/Paiement'
import Login from '../Components/Login'
import AttentePaiement from '../Components/AttentePaiement'

const SearchStackNavigator = createStackNavigator({
  
  Index: {
    screen: Index,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>SuperMark</Text>
    }
  },
  Inscription: {
    screen: Inscription,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Inscription</Text>
    }
  },
  Catalogue: {
    screen: Catalogue,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>SuperMark</Text>,
      headerLeft: () => {return(<Image style={{width: 55,height: 55}} source={require('../assets/icon.png')}/>)}
    }
  },
  Verification:{
    screen: Verification,
    navigationOptions :{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Vérification</Text>
    }
  },
  CategorieDetail: {
    screen: CategorieDetail,
    navigationOptions:{
    }
  },
  ProduitDetail: {
    screen: ProduitDetail,
    navigationOptions:{
      headerTitleAlign: 'center'
    }
  },
  Panier: {
    screen: Panier,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Panier</Text>
    }
  },
  Transport: {
    screen : Transport,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Transport</Text> 
    }
  },
  InfoPerso:{
    screen: InfoPerso,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Informations</Text> 
    }
  },
  Account:{
    screen: Account,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Mon profil</Text> 
    }
  },
  MesCommandes:{
    screen: MesCommandes,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Mes commandes</Text> 
    }
  },
  Paiement:{
    screen: Paiement,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Paiement</Text> 
    }
  },
  Login:{
    screen: Login,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Connexion</Text> 
    }
  },
  AttentePaiement:{
    screen: AttentePaiement,
    navigationOptions:{
      headerTitle: () => <Text style={{textAlign: 'center', flex: 1, fontSize: 20}}>Attente Paiement</Text> 
    }
  }

  },{
    initialRouteName: 'Index',
    defaultNavigationOptions:{
      ...TransitionPresets.SlideFromRightIOS
    },
  })

export default createAppContainer(SearchStackNavigator)