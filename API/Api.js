import ENV from '../environment'



export function getIdFromRegistration (profil) {
  /*const url = ENV.SERV + ENV.URL_INSCRIPTION + 
              "?name=" + profil.name +
              "&username=" + profil.username+
              "&email=" + profil.email+
              "&tel=" + profil.tel+
              "&newsletter=" + profil.newsletter+
              "&sms=" + profil.sms+
              "&rgpd=" + profil.rgpd;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))*/

  let devResp = {
    success: true,
    data:{id:'lksjdfgjdsflgsdk55500'},
    error:{}
  }
  return devResp;

  /*let devResp = {
    success: false,
    data:{},
    error:{
      code: 20,
      desc: "Erreur save ID"
    }
  }
  return devResp;*/
}

export function checkVerify(data){
/*const url = ENV.SERV + ENV.URL_ASK_VERIFICATION +
            "?id=" + data.id+
            "&email=" + data.email+
            "&tel=" + data.tel;
return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/

  let devResp = {
    success: true,
    data:{email:true,
          tel:true},
    error:{}
  }
  return devResp
}

export function sendVerifiedCode(data){
  let url = ENV.SERV + ENV.URL_SEND_VERIFICATION + "?id=" + data.id

  if(!data.emailVerified){
    url +=  "&email=" + data.email+
            "&emailCode=" + data.emailCode
  }
  if(!data.telVerified){
    url +=  "&tel=" + data.tel+
            "&telCode=" + data.telCode;
  }

  console.log(url);
  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/

  /*let devResp = {
    success: true,
    data:{verified: true},
    error:{}
  }*/
  let verifMail = false
  if(data.emailCode === "123456" | data.emailVerified){
    verifMail = true
  }
  let verifTel = false
  if(data.telCode === "123456" | data.telVerified){
    verifTel = true
  }

  console.log("Verif mail ! " + verifMail)
  console.log("Verif tel ! " + verifTel)

  let devResp = {
    success: true,
    data:{verified: (verifMail & verifTel),email:verifMail,tel:verifTel},
    error:{}
  }
  return devResp;
}

export function resendCode(data){
  let url = ENV.SERV + ENV.URL_RESEND_CODE + "?id=" + data.id

  if(data.emailResend){
    url += "&email=" + data.email
  }
  if(data.telResend){
    url += "&tel=" + data.tel 
  }
  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/
  
  console.log(url)

  let devResp = {
    success: true,
    data:{resend: true},
    error:{}
  }
  return devResp
}

export function editMailTel(data){
  let url = ENV.SERV + ENV.URL_MODIF_MAIL_TEL + "?id=" + data.id

  if(data.emailEdit){
    url += "&email=" + data.email
  }
  if(data.telEdit){
    url += "&tel=" + data.tel
  }
  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/

  console.log(url)
  let devResp = {
    success: true,
    data:{edited: true},
    error:{}
  }
  return devResp
}

export function loadCatalogue(){
  let url = ENV.SERV + ENV.URL_CATALOGUE

  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/
  console.log(url);
  var json = require("../JSON/listCat.json")
  return null;
}

export function loadVP(){
  let url = ENV.SERV + ENV.URL_VP

  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/

  var json = require("../JSON/vp.json")
  return null;
}

export function loadCategorie(idCat){
  let url = ENV.SERV + ENV.URL_CATEGORIE + "?idCat=" + idCat; 

  console.log(url)
  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/
  var json = require("../JSON/Fruits.json")
  return null;
}

export function loadVp(idVp){
  let url = ENV.SERV + ENV.URL_DETAILS_VP + "?idVp=" + idVp; 

  console.log(url)
  /*return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))*/
  var json = require("../JSON/produitsVp.json")
  return null;
}

export function loadAll(){
  /*//var json = require("../JSON/all")
  var json = require("../JSON/new")
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
  return json;*/

  let url = "http://********************,/index.php"+"?load";

  console.log("api done")

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function addToPanier(data){
  let url = "http://********************,/index.php"+"?addPanier&id=" + data.id + "&idproduit=" + data.produit.id + "&qte=" + data.qte;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function addQtePanier(data){
  let url = "http://********************,/index.php"+"?addQtePanier&id=" + data.id + "&idproduit=" + data.idproduit;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function subQtePanier(data){
  let url = "http://********************,/index.php"+"?subQtePanier&id=" + data.id + "&idproduit=" + data.idproduit;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function removePanier(data){
  let url = "http://********************,/index.php"+"?removePanier&id=" + data.id + "&idproduit=" + data.idproduit;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function loadPanier(data){
  let url = "http:/********************,/index.php"+"?loadPanier&id=" + data.id;
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function loadCommandes(data){
  let url = "http:/********************,/index.php"+"?loadCommandes&id=" + data.id;
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function addAdresse(data){
  let url = "http://********************,/index.php"+"?addAdresse"+ 
    "&id=" + data.id +
    "&prenom=" + data.prenom +
    "&nom=" + data.nom +
    "&adresse=" + data.adresse +
    "&compAdresse=" + data.compAdresse +
    "&cp=" + data.codePostal +
    "&ville=" + data.ville +
    "&pays=" + data.pays +
    "&telephone=" + data.telephone;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function addAdresseFact(data){
  let url = "http://********************,/index.php"+"?addAdresseFact"+ 
    "&id=" + data.id +
    "&prenom=" + data.prenom +
    "&nom=" + data.nom +
    "&adresse=" + data.adresse +
    "&compAdresse=" + data.compAdresse +
    "&cp=" + data.codePostal +
    "&ville=" + data.ville +
    "&pays=" + data.pays +
    "&telephone=" + data.telephone;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function addTransporteur(data){
  let url = "http://********************,/index.php"+"?addTypeLivraison"+ 
    "&id=" + data.id +
    "&idLiv=" + data.idLiv;

  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))

}

export function validationPanier(data){
  let url = "http://********************,/index.php"+"?validerPanier&id=" + data.id;
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export function choixMethodePaiement(data){
  let url = "http://********************,/index.php"+"?addMethodePaiement"+
    "&id=" + data.id +
    "&idPaiement=" + data.idPaiement;
  
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}
