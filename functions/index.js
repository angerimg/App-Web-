const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const config = require('./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json');
const express = require('express');
const Joi = require('joi');//Joi te devuelve una clase por esta razon la variable
//empieza en mayuscula
const app1 = express();
const app2 = express();
const app3 = express();

app1.use(express.json());
app2.use(express.json());
app3.use(express.json());

//console.log(path.resolve(__dirname, './turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json'));
firebase.initializeApp({
  credential: firebase.credential.cert(require('./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json')),
  databaseURL: 'https://turnos-virtuales.firebaseio.com/'
});



//crudTurnos
//get usuario desde un turno en especifico, mandando ID==========================

app1.get('/gU/:id', (req, res) => {
  const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
  turnos.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.child("id_usuario"));
      }
    });
  });
});
exports.getUsuarioTurno = functions.https.onRequest(app1);


//Get all desde tabla turno==================================

app2.get('/gT', (req, res) => {
  const turnos = firebase.database().ref('/turno'); // Referencia a la base de datos
  turnos.on('value', (snapshot) => {
    res.json(snapshot.val());
    //res.json(snapshot.val()); //Manda los datos obtenidos en JSON
  });
});
exports.getTurnos = functions.https.onRequest(app2);





//crear un turno nuevo en la tabla turno==============================

app3.post("/pT", (req, res) => {

  const turnos = firebase.database().ref('/turno');
  const turno = req.body; // El objeto que mandamos.
  const { error } = validateTurno(turno);//valida el turno contra el esquema
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  turnos.push(turno) // Crea un nuevo objeto con ID aleatorio.
    .then(res.json(turno))
    .catch(err => res.json(err));
});
exports.postTurno = functions.https.onRequest(app3);




//editar turno existente=================================================
const app4 = express();
app4.put("/eT/:id", (req, res) => {

  const turnos = firebase.database().ref('/turno');
  const turno = req.body; // El objeto que mandamos.
  const { error } = validateTurno(turno);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  turnos.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;

      if (key === req.params.id) {
        if (req.body.id_usuario) {
          childSnapshot.ref.update({ id_usuario: req.body.id_usuario });
        } else if (req.body.id_negocio) {
          childSnapshot.ref.update({ id_negocio: req.body.id_negocio });
        } else if (req.body.duracion_turno) {
          childSnapshot.ref.update({ no_turno: req.body.duracion_turno });
        } else if (req.body.fecha) {
          childSnapshot.ref.update({ no_turno: req.body.fecha });
        } else if (req.body.hora_finalizado) {
          childSnapshot.ref.update({ no_turno: req.body.hora_finalizado });
        } else if (req.body.hora_inicio_atencion) {
          childSnapshot.ref.update({ no_turno: req.body.hora_inicio_atencion });
        } else if (req.body.hora_pedido) {
          childSnapshot.ref.update({ no_turno: req.body.hora_pedido });
        } else if (req.body.id_cola) {
          childSnapshot.ref.update({ no_turno: req.body.id_cola });
        } else if (req.body.id_estacion_trabajo) {
          childSnapshot.ref.update({ no_turno: req.body.id_estacion_trabajo });
        } else if (req.body.id_estado) {
          childSnapshot.ref.update({ no_turno: req.body.id_estado });
        } else if (req.body.id_servicio) {
          childSnapshot.ref.update({ no_turno: req.body.id_servicio });
        } else if (req.body.id_sucursal) {
          childSnapshot.ref.update({ no_turno: req.body.id_sucursal });
        } else if (req.body.no_turno) {
          childSnapshot.ref.update({ no_turno: req.body.no_turno });
        } else if (req.body.tiempo_estimado_espera) {
          childSnapshot.ref.update({ tiempo_estimado_espera: req.body.tiempo_estimado_espera });
        } else if (req.body.presente) {
          childSnapshot.ref.update({ presente: req.body.presente });
        } else if (req.body.activo) {
          childSnapshot.ref.update({ activo: req.body.activo });
        }
        res.send(childSnapshot);

      }
    });
  });
  exports.editTurno = functions.https.onRequest(app4);


  //Esquema de como debe ser un turno.
  //pueden faltar campos pero no puede tener demas el objeto que se manda.
  function validateTurno(turno) {
    const schema = {
      activo: Joi.string().min(4),
      duracion_turno: Joi.string().min(2),
      fecha: Joi.string().min(10),
      hora_finalizado: Joi.string().min(5),
      hora_inicio_atencion: Joi.string().min(5),
      hora_pedido: Joi.string().min(5),
      id_cola: Joi.string().min(6),
      id_estacion_trabajo: Joi.string().min(6),
      id_estado: Joi.string().min(6),
      id_negocio: Joi.string().min(6),
      id_servicio: Joi.string().min(6),
      id_sucursal: Joi.string().min(6),
      id_usuario: Joi.string().min(6),
      no_turno: Joi.string().min(1),
      presente: Joi.string().min(4),
      tiempo_estimado_espera: Joi.string().min(5)
    };
    return Joi.validate(turno, schema);
  }






/*
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
*/

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


