const functions = require('firebase-functions');
const firebase =require('firebase-admin');
const config = require('./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json');

//console.log(path.resolve(__dirname, './turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json'));
firebase.initializeApp({
    credential: firebase.credential.cert(require('./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json')),
    databaseURL: 'https://turnos-virtuales.firebaseio.com/'
});


exports.turno = functions.https.onRequest((req, res) => {
    if(req.method === 'GET') { //Verifica si es GET
        const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
        turnos.on('value', (snapshot) => {
            res.json(snapshot.val()); //Manda los datos obtenidos en JSON
        });
    }else if (req.method === 'POST') {
      const turnos = firebase.database().ref('/turno');
      const turno = req.body; // El objeto que mandemos.
      turnos.push(turno) // Crea un nuevo objeto con ID aleatorio.
          .then(res.json(turno))
          .catch(err => res.json(err))
  }
});


