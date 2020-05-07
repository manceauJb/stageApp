/***
 *      #############################
 *                  API
 *      #############################
 *      
 *  Envoi lors de l'inscription :
 * 
 *  $SERV + $URL_INSCRIPTION
 *      + ?name="$name&username="$username&email=$email&tel=$tel&newsletter=$newsletter&sms=$sms&rgpd=$rgpd
 * 
 *  Reponse attendu format JSON:
 *              (reussi)
 *      {
 *          success: true,
 *          data:   {
 *                      id: 'String'
 *                  }
 *          error: {}
 *      }
 *           ###############
 *              (error)
 *      {
 *          success: false,
 *          data:{}
 *          error:  {
 *                      code: 'int',
 *                      desc: 'String'
 *                  }
 *      }
 */



const ENV = {
    firebaseConfig : {
        apiKey: ****************,
        authDomain: ***************,
        databaseURL: ********************,
        projectId: ********************,
        storageBucket: ********************,
        messagingSenderId:********************,
        appId: ********************,
        measurementId: ********************,
      },
    

    PRIMARY_COLOR:"#98d8d9",
    SECONDARY_COLOR:'#666666',

    AFFICHAGE : 2, // 0x000001 == Prix TTC
                   // 0x000010 == Prix HT

    SERV:"https://ensweb.users.info.unicaen.fr",
    
    
    URL_INSCRIPTION:"/android-api/",

    URL_ASK_VERIFICATION:"/verified/",
    VERIFICATION_TIME: 10000, //Nombre ms, 

    URL_SEND_VERIFICATION:"/sendcode/",

    URL_RESEND_CODE:"/resendcode/",
    
    URL_MODIF_MAIL_TEL:"/edited/",

    URL_CATALOGUE:"/catalogue",

    URL_VP: "/venteprivee",

    URL_CATEGORIE:"/categorie",

    URL_DETAILS_VP: "/ventprivee/",

    URL_ADRESSE: "/adresse"
}
export default ENV
