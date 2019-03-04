const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const AUTH_TOKEN = 'Zmx1aWc6YXNpb2hpZGphc2Q3OGRoZDM4N2gzNzhoQCYhKnkhQCM='; 
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/house.html');
});

/* Webhook */
app.post('/api/webhook', ( req, res ) => {
    // Check if autorized
    if ( req.headers['auth-token'] !== AUTH_TOKEN ) {
        return res.status( 401 ).send('Sem autorização' );
    } else {
        var body = req.body;
        // Check if has a valid request
        if ( !body ) {
            return res.status( 400 ).send( 'Erro 400: Bad Request' );
        } else {
            // Extracting values
            var obj = body.obj;
            var value = body.value;
            console.log(obj + " = " + value);

            // Checking value
            if ( value == 'on' ){
                var msg = 'A lâmpada foi ligada!';
                io.emit( obj, value );
            } else if( value == 'off' ){
                var msg = 'A lâmpada foi desligada!';
                io.emit( obj, value );
            } else {
                var msg = 'Comando não reconhecido';   
            }
            res.status( 200 ).send( msg );

        }
    }
});

/* Socket Handler */
io.on('connection', function(client){
    console.log('user connected');

    client.on('set', function(obj, value){
        console.log('obj: ' + obj + " - value: " + value);
    });

    // User disconnect
    client.on('disconnect', function(){
        console.log('user disconnected');
    });
});



http.listen(port, function(){
    console.log('listening on port ' + port);
});