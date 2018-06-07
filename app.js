const express = require('express')
const app = express()
const port = 3000

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let admin = require('firebase-admin');
let firebase = require('firebase');

let config = {
    apiKey: "AIzaSyCUVCJ453FqXEcmUxXthq9oSi2Nex7qKC4",
    authDomain: "fir-functions-bc2ab.firebaseapp.com",
    databaseURL: "https://fir-functions-bc2ab.firebaseio.com",
    projectId: "fir-functions-bc2ab",
    storageBucket: "fir-functions-bc2ab.appspot.com",
    messagingSenderId: "294274764437"
};
firebase.initializeApp(config);

let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fir-functions-bc2ab.firebaseio.com'
});

let firestrore = admin.firestore();
let uniqueId = [];

//get id's from firestore
firestrore.collection('conversation').get()
    .then((querySnapshot) => {
      
        let conversation = [];
        querySnapshot.forEach((doc) => {conversation.push(doc.data() )});
        
        let id = [];
        conversation.forEach((eachMessageData, index) => {
            id.push(`${eachMessageData.originalDetectIntentRequest.payload.data.sender.id}`)
        })
      
        for (let index = 0; index < id.length; index++) {
            let currentId = id[index];
            if (!uniqueId.includes(currentId)) 
                uniqueId.push(currentId);
        }
          console.log(uniqueId);
    })
    .catch((err => {
        console.log("Error: ", err);
}))
    

app.get('/', (req, res) => {
    res.sendfile('views/index.html');
})

// send message to all id
app.post('/send', (req, res) => {
    console.log(req.body.message);
    let mes = req.body.message;
        
    let FBMessenger = require('fb-messenger');
    let messenger = new FBMessenger('EAADWhiHBnQoBACy8w0RN20kNqQd02duaraYZAGYBt4lBIZB3SLiWZAZByxWvmR7SVRY46LtGMnZA2CBMmmsZCqkS9pL3ALvb6e4adGuSueSuMp0U5UZAkOS2Luxo3QU8j2QZBm7YObOgYY4ttxcyFEefPWXDczSAzJl3Frs660FopAZDZD');
    
    //sending to every unique id in firestore
    for (let i = 0; i<uniqueId.length ; i++){       
        messenger.sendTextMessage(uniqueId[i], mes);
    }

    //writing message sent to realtime db in firebase 
    admin.database().ref('/messages').push({message: mes}).then((snapshot) => {
        //res.redirect(303, snapshot.ref.toString());
        res.redirect('/sent');
    });
})

app.get('/sent', (req, res) => {
    res.sendfile('views/sent.html');
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})