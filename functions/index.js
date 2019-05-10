const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const config = require('./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json');
const express = require('express');

//console.log(path.resolve(__dirname, './turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json'));
firebase.initializeApp({
  credential: firebase.credential.cert(require('./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json')),
  databaseURL: 'https://turnos-virtuales.firebaseio.com/'
});

// const Joi = require('joi');//Joi te devuelve una clase por esta razon la variable
//empieza en mayuscula
//app.use(express.json());



const app = express();
app.get('/:id', (req, res) => {
  const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
  turnos.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.child("id_usuario"));
      }
    });
    //res.json(snapshot.val()); //Manda los datos obtenidos en JSON
  });
});
exports.app = functions.https.onRequest(app);




exports.turnos = functions.https.onRequest((req, res) => {
  const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
  turnos.on('value', (snapshot) => {

    if (req.method === 'GET') { //Verifica si es GET
      const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
      turnos.on('value', (snapshot) => {
        res.json(snapshot.val()); //Manda los datos obtenidos en JSON
      });
    }
  });
});



















/* const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
    turnos.on('value', (snapshot) => {
     // res.json(snapshot.val()); //Manda los datos obtenidos en JSON
     res.send("hello");
    });
   // res.send(); */
  //exports.turno = functions.https.onRequest(app);

/*
  if (req.method === 'GET') { //Verifica si es GET
    const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
    turnos.on('value', (snapshot) => {
      res.json(snapshot.val()); //Manda los datos obtenidos en JSON
    });
  } else if (req.method === 'POST') {
    const turnos = firebase.database().ref('/turno');
    const turno = req.body; // El objeto que mandemos.
    turnos.push(turno) // Crea un nuevo objeto con ID aleatorio.
      .then(res.json(turno))
      .catch(err => res.json(err))
  } else if (req.method === 'GET') { //Verifica si es GET
    const turnos = firebase.database().ref('/turno/{usuario}'); // Referencia a la base de datos
    turnos.on('value', (snapshot) => {
      const json = snapshot.val();
      json.forEach(element => {
        if (element.id_usuario === req.param.usuario) {
          res.json(element); //Manda los datos obtenidos en JSON
        }
      });

    });
  }*/


