const express = require('express')
const app = express()
const port = 3000

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

app.post('/', (req, res) => {
    console.log(req.body.message);
    let mes = req.body.message;
        
    var FBMessenger = require('fb-messenger');
    var messenger = new FBMessenger('EAADWhiHBnQoBACy8w0RN20kNqQd02duaraYZAGYBt4lBIZB3SLiWZAZByxWvmR7SVRY46LtGMnZA2CBMmmsZCqkS9pL3ALvb6e4adGuSueSuMp0U5UZAkOS2Luxo3QU8j2QZBm7YObOgYY4ttxcyFEefPWXDczSAzJl3Frs660FopAZDZD');
        
    messenger.sendTextMessage('1654303328018515', mes);

  })

app.get('/test', function(req, res){
    res.sendfile('test.html');
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})