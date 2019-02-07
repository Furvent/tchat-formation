"use strict";

//On importe les dépendances
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let users = new Map();

//On envoie le fichier html de base à notre serveur
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/lodash', function (req, res) {
    res.sendFile(__dirname + '/lodash.min.js');
});

//On lance notre serveur
http.listen(3456, function () {
    console.log('Server started, listening on port *:3456');
});

//Socket est passé automatiquement par socket io et c'est le socket qui est créé entre le serveur et le client, evenement 
//prédéfini
//On va écouter des evenements et déclencher des fonctions qui vont s'executer quand les evenements ont lieu
io.on('connection', function (socket) {
    console.log("un utilisateur s'est connecté");
    //Quand on reçoit un message de l'utilisateur on fait quelque chose
    socket.on("msg", function (message) {
        let pseudo = users.get(socket.id).pseudo;
        //On veut renvoyer le message a tous les utilisateurs connectés
        //On renvoie le message a tout le monde y compris à celui qui l'a envoyé, pour l'envoyer uniquement à certaines
        // personnes on peut utiliser plutot broadcast
        // And we send pseudo
        io.emit("msg", { mess: message, psd: pseudo });
    });
    socket.on("getPseudo", function (pseudo) {
        console.log("User: " + socket.id + " chosen an alias: " + pseudo);
        // On reçoit le pseudo de l'utilisateur et on le stocke dans la map.
        users.set(socket.id, { pseudo: pseudo });
    });
    socket.on('mousemove', function (data) {
        data.id = socket.id;
        socket.broadcast.emit('mousemove', data);
    });
    socket.on('disconnect', function() {
        socket.broadcast.emit('userdisconnected', {id: socket.id})
    });
});

//Pour jeudi: faire un prompt qui demande le pseudo à l'util , donc creer une méthode login sur le serveur
// qui reçoit une chaine de charactere qui est le pseudo, puis on émet le login  et on le lie à quelque chose, 
// on peut ajouter une propriété pseudo à notre socket et coté serveur on réémet le message avec le pseudo (socket.pseudo:message)
