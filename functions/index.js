const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const config = require("./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json");
const express = require("express");
const Joi = require("joi"); //Joi te devuelve una clase por esta razon la variable
//empieza en mayuscula

///////

const appTurno1 = express(); //
const appTurno2 = express();
const appTurno3 = express();
const appTurno4 = express();
const appTurno5 = express();

appTurno1.use(express.json());
appTurno2.use(express.json());
appTurno3.use(express.json());
appTurno4.use(express.json());
appTurno5.use(express.json());

////////

const appNegocio1 = express(); //
const appNegocio2 = express();
const appNegocio3 = express();
const appNegocio4 = express();
const appNegocio5 = express();

appNegocio1.use(express.json());
appNegocio2.use(express.json());
appNegocio3.use(express.json());
appNegocio4.use(express.json());
appNegocio5.use(express.json());

////////

const appSucursal1 = express(); //
const appSucursal2 = express();
const appSucursal3 = express();
const appSucursal4 = express();
const appSucursal5 = express();

appSucursal1.use(express.json());
appSucursal2.use(express.json());
appSucursal3.use(express.json());
appSucursal4.use(express.json());
appSucursal5.use(express.json());

////////

const appServicio1 = express();
const appServicio2 = express();
const appServicio3 = express();
const appServicio4 = express();
const appServicio5 = express();

appServicio1.use(express.json());
appServicio2.use(express.json());
appServicio3.use(express.json());
appServicio4.use(express.json());
appServicio5.use(express.json());

////////

const appCola1 = express();
const appCola2 = express();
const appCola3 = express();
const appCola4 = express();
const appCola5 = express();

appCola1.use(express.json());
appCola2.use(express.json());
appCola3.use(express.json());
appCola4.use(express.json());
appCola5.use(express.json());

////////

const appEstacion_trabajo1 = express();
const appEstacion_trabajo2 = express();
const appEstacion_trabajo3 = express();
const appEstacion_trabajo4 = express();
const appEstacion_trabajo5 = express();

appEstacion_trabajo1.use(express.json());
appEstacion_trabajo2.use(express.json());
appEstacion_trabajo3.use(express.json());
appEstacion_trabajo4.use(express.json());
appEstacion_trabajo5.use(express.json());

////////

const appTipo_estado_turno1 = express();
const appTipo_estado_turno2 = express();
const appTipo_estado_turno3 = express();
const appTipo_estado_turno4 = express();
const appTipo_estado_turno5 = express();

appTipo_estado_turno1.use(express.json());
appTipo_estado_turno2.use(express.json());
appTipo_estado_turno3.use(express.json());
appTipo_estado_turno4.use(express.json());
appTipo_estado_turno5.use(express.json());

////////

const appUsuario1 = express();
const appUsuario2 = express();
const appUsuario3 = express();
const appUsuario4 = express();
const appUsuario5 = express();

appUsuario1.use(express.json());
appUsuario2.use(express.json());
appUsuario3.use(express.json());
appUsuario4.use(express.json());
appUsuario5.use(express.json());

////////

const appTipo_usuario1 = express();
const appTipo_usuario2 = express();
const appTipo_usuario3 = express();
const appTipo_usuario4 = express();
const appTipo_usuario5 = express();

appTipo_usuario1.use(express.json());
appTipo_usuario2.use(express.json());
appTipo_usuario3.use(express.json());
appTipo_usuario4.use(express.json());
appTipo_usuario5.use(express.json());

////////

//console.log(path.resolve(__dirname, './turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json'));
firebase.initializeApp({
  credential: firebase.credential.cert(
    require("./turnos-virtuales-firebase-adminsdk-9458v-51213b498f.json")
  ),
  databaseURL: "https://turnos-virtuales.firebaseio.com/"
});

//crudTurnos
//get usuario desde un turno en especifico, mandando ID==========================

appTurno1.get("/gT/:id", (req, res) => {
  const turnos = firebase.database().ref("/turno"); // Referencia a la base de datos
  turnos.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.val());
      }
    });
  });
});
exports.getTurnoById = functions.https.onRequest(appTurno1);

//Get all desde tabla turno==================================

appTurno2.get("/gT", (req, res) => {
  const turnos = firebase.database().ref("/turno"); // Referencia a la base de datos
  turnos.on("value", snapshot => {
    res.json(snapshot.val());
    //res.json(snapshot.val()); //Manda los datos obtenidos en JSON
  });
});
exports.getTurnos = functions.https.onRequest(appTurno2);

//crear un turno nuevo en la tabla turno==============================

appTurno3.post("/pT", (req, res) => {
  const turnos = firebase.database().ref("/turno"),
    turno = req.body, // El objeto que mandamos.
    { error } = validateTurno(turno); //valida el turno contra el esquema

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  turnos
    .push(turno) // Crea un nuevo objeto con ID aleatorio.
    .then(res.json(turno))
    .catch(err => res.json(err));
});
exports.postTurno = functions.https.onRequest(appTurno3);

//editar turno existente=================================================

appTurno4.put("/eT/:id", (req, res) => {
  const turnos = firebase.database().ref("/turno");
  const turno = req.body; // El objeto que mandamos.
  const { error } = validateTurno(turno);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  turnos.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;

      if (key === req.params.id) {
        if (req.body.id_usuario) {
          childSnapshot.ref.update({ id_usuario: req.body.id_usuario });
        }
        if (req.body.id_negocio) {
          childSnapshot.ref.update({ id_negocio: req.body.id_negocio });
        }
        if (req.body.duracion_turno) {
          childSnapshot.ref.update({ duracion_turno: req.body.duracion_turno });
        }
        if (req.body.fecha) {
          childSnapshot.ref.update({ fecha: req.body.fecha });
        }
        if (req.body.hora_finalizado) {
          childSnapshot.ref.update({
            hora_finalizado: req.body.hora_finalizado
          });
        }
        if (req.body.hora_inicio_atencion) {
          childSnapshot.ref.update({
            hora_inicio_atencion: req.body.hora_inicio_atencion
          });
        }
        if (req.body.hora_pedido) {
          childSnapshot.ref.update({ hora_pedido: req.body.hora_pedido });
        }
        if (req.body.id_cola) {
          childSnapshot.ref.update({ id_cola: req.body.id_cola });
        }
        if (req.body.id_estacion_trabajo) {
          childSnapshot.ref.update({
            id_estacion_trabajo: req.body.id_estacion_trabajo
          });
        }
        if (req.body.id_estado) {
          childSnapshot.ref.update({ id_estado: req.body.id_estado });
        }
        if (req.body.id_servicio) {
          childSnapshot.ref.update({ id_servicio: req.body.id_servicio });
        }
        if (req.body.id_sucursal) {
          childSnapshot.ref.update({ id_sucursal: req.body.id_sucursal });
        }
        if (req.body.no_turno) {
          childSnapshot.ref.update({ no_turno: req.body.no_turno });
        }
        if (req.body.tiempo_estimado_espera) {
          childSnapshot.ref.update({
            tiempo_estimado_espera: req.body.tiempo_estimado_espera
          });
        }
        if (req.body.presente) {
          childSnapshot.ref.update({ presente: req.body.presente });
        }
        if (req.body.activo) {
          childSnapshot.ref.update({ activo: req.body.activo });
        }
        res.send(childSnapshot);
      }
    });
  });
});
exports.editTurno = functions.https.onRequest(appTurno4);

//Cancelar un turno existente (no se borra, aparece como cancelado.)

appTurno5.put("/can/:id", (req, res) => {
  const turnos = firebase.database().ref("/turno");
  turnos.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        childSnapshot.ref.update({ activo: "false" });
        res.send(childSnapshot);
      }
    });
  });
});

exports.cancelTurno = functions.https.onRequest(appTurno5);

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

/**********************************************************************************************************/
//crudNegocio
//get one negocio, mandando ID==========================

appNegocio1.get("/gN/:id", (req, res) => {
  const negocios = firebase.database().ref("/negocio"); // Referencia a la base de datos
  negocios.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.val());
      }
    });
  });
});
exports.getNegocioById = functions.https.onRequest(appNegocio1);

//Get all desde tabla negocio==================================

appNegocio2.get("/gN", (req, res) => {
  const negocios = firebase.database().ref("/negocio"); // Referencia a la base de datos
  negocios.on("value", snapshot => {
    res.json(snapshot.val());
  });
});
exports.getNegocios = functions.https.onRequest(appNegocio2);

//crear un turno nuevo en la tabla turno==============================

appNegocio3.post("/pN", (req, res) => {
  const negocios = firebase.database().ref("/negocio"),
    negocio = req.body, // El objeto que mandamos.
    { error } = validateNegocio(negocio); //valida el Negocio contra el esquema

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  negocios
    .push(negocio) // Crea un nuevo objeto con ID aleatorio.
    .then(res.json(negocio))
    .catch(err => res.json(err));
});
exports.postNegocio = functions.https.onRequest(appNegocio3);

//editar turno existente=================================================

appNegocio4.put("/eN/:id", (req, res) => {
  const negocios = firebase.database().ref("/negocio");
  const negocio = req.body; // El objeto que mandamos.
  const { error } = validateNegocio(negocio);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  negocios.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        if (req.body.descripcion) {
          childSnapshot.ref.update({ descripcion: req.body.descripcion });
        }
        if (req.body.id_admin) {
          childSnapshot.ref.update({ id_admin: req.body.id_admin });
        }
        if (req.body.nombre) {
          childSnapshot.ref.update({ nombre: req.body.nombre });
        }
        if (req.body.activo) {
          childSnapshot.ref.update({ nombre: req.body.activo });
        }
        res.send(childSnapshot);
      }
    });
  });
});
exports.editNegocio = functions.https.onRequest(appNegocio4);

//Cancelar un negocio existente (no se borra, aparece como cancelado.)

appNegocio5.put("/can/:id", (req, res) => {
  const negocios = firebase.database().ref("/negocio");
  negocios.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        childSnapshot.ref.update({ activo: "false" });
        res.send(childSnapshot);
      }
    });
  });
});
exports.cancelNegocio = functions.https.onRequest(appNegocio5);

function validateNegocio(negocio) {
  const schema = {
    descripcion: Joi.string().min(10),
    id_admin: Joi.string().min(6),
    nombre: Joi.string().min(5),
    activo: Joi.string().min(4)
  };
  return Joi.validate(negocio, schema);
}

/**********************************************************************************************************/
//crudSucursal
//get one negocio, mandando ID==========================

appSucursal1.get("/gS/:id", (req, res) => {
  const sucursales = firebase.database().ref("/sucursal"); // Referencia a la base de datos
  sucursales.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.val());
      }
    });
  });
});
exports.getSucursalById = functions.https.onRequest(appSucursal1);

//Get all desde tabla negocio==================================

appSucursal2.get("/gS", (req, res) => {
  const sucursales = firebase.database().ref("/sucursal"); // Referencia a la base de datos
  sucursales.on("value", snapshot => {
    res.json(snapshot.val());
  });
});
exports.getSucursales = functions.https.onRequest(appSucursal2);

//crear un turno nuevo en la tabla turno==============================

appSucursal3.post("/pS", (req, res) => {
  const sucursales = firebase.database().ref("/sucursal"),
    sucursal = req.body, // El objeto que mandamos.
    { error } = validateSucursal(sucursal); //valida el Negocio contra el esquema

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  sucursales
    .push(sucursal) // Crea un nuevo objeto con ID aleatorio.
    .then(res.json(sucursal))
    .catch(err => res.json(err));
});
exports.postSucursal = functions.https.onRequest(appSucursal3);

//editar turno existente=================================================

appSucursal4.put("/eS/:id", (req, res) => {
  const sucursales = firebase.database().ref("/sucursal");
  const sucursal = req.body; // El objeto que mandamos.
  const { error } = validateNegocio(sucursal);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  sucursales.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        if (req.body.cant_personas_presentes) {
          childSnapshot.ref.update({
            cant_personas_presentes: req.body.cant_personas_presentes
          });
        }
        if (req.body.descripcion) {
          childSnapshot.ref.update({ descripcion: req.body.descripcion });
        }
        if (req.body.id_negocio) {
          childSnapshot.ref.update({ id_negocio: req.body.id_negocio });
        }
        if (req.body.nombre) {
          childSnapshot.ref.update({ nombre: req.body.nombre });
        }
        if (req.body.activo) {
          childSnapshot.ref.update({ nombre: req.body.activo });
        }
        res.send(childSnapshot);
      }
    });
  });
});
exports.editSucursal = functions.https.onRequest(appSucursal4);

//Cancelar un negocio existente (no se borra, aparece como cancelado.)

appSucursal5.put("/can/:id", (req, res) => {
  const sucursales = firebase.database().ref("/sucursal");
  sucursales.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        childSnapshot.ref.update({ activo: "false" });
        res.send(childSnapshot);
      }
    });
  });
});
exports.cancelSucursal = functions.https.onRequest(appSucursal5);

function validateSucursal(sucursal) {
  const schema = {
    activo: Joi.string().min(4),
    cant_personas_presentes: Joi.string().min(1),
    direccion: Joi.string().min(10),
    id_negocio: Joi.string().min(6),
    nombre: Joi.string().min(5)
  };
  return Joi.validate(sucursal, schema);
}

/**********************************************************************************************************/
//crudServicios
//get one negocio, mandando ID==========================

appServicio1.get("/gSer/:id", (req, res) => {
  const servicios = firebase.database().ref("/servicio"); // Referencia a la base de datos
  servicios.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.val());
      }
    });
  });
});
exports.getServicioById = functions.https.onRequest(appServicio1);

//Get all desde tabla negocio==================================

appServicio2.get("/gSer", (req, res) => {
  const servicios = firebase.database().ref("/servicio"); // Referencia a la base de datos
  servicios.on("value", snapshot => {
    res.json(snapshot.val());
  });
});
exports.getServicios = functions.https.onRequest(appServicio2);

//crear un turno nuevo en la tabla turno==============================

appServicio3.post("/pSer", (req, res) => {
  const servicios = firebase.database().ref("/servicio"),
    servicio = req.body, // El objeto que mandamos.
    { error } = validateServicio(servicio); //valida el Negocio contra el esquema

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  servicios
    .push(servicio) // Crea un nuevo objeto con ID aleatorio.
    .then(res.json(servicio))
    .catch(err => res.json(err));
});
exports.postServicio = functions.https.onRequest(appServicio3);

//editar turno existente=================================================

appServicio4.put("/eSer/:id", (req, res) => {
  const servicios = firebase.database().ref("/servicio");
  const servicio = req.body; // El objeto que mandamos.
  const { error } = validateServicio(servicio);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  servicios.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        if (req.body.nombre) {
          childSnapshot.ref.update({ nombre: req.body.nombre });
        }
        if (req.body.id_tiempo_estimado) {
          childSnapshot.ref.update({
            id_tiempo_estimado: req.body.id_tiempo_estimado
          });
        }
        if (req.body.activo) {
          childSnapshot.ref.update({ activo: req.body.activo });
        }
        if (req.body.descripcion) {
          childSnapshot.ref.update({ descripcion: req.body.descripcion });
        }
        if (req.body.id_cola) {
          childSnapshot.ref.update({ id_cola: req.body.id_cola });
        }
        if (req.body.id_negocio) {
          childSnapshot.ref.update({ id_negocio: req.body.id_negocio });
        }
        res.send(childSnapshot);
      }
    });
  });
});
exports.editServicio = functions.https.onRequest(appServicio4);

//Cancelar un negocio existente (no se borra, aparece como cancelado.)

appServicio5.put("/can/:id", (req, res) => {
  const servicios = firebase.database().ref("/servicio");
  servicios.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        childSnapshot.ref.update({ activo: "false" });
        res.send(childSnapshot);
      }
    });
  });
});
exports.cancelServicio = functions.https.onRequest(appServicio5);

function validateServio(servicio) {
  const schema = {
    activo: Joi.string().min(4),
    descripcion: Joi.string().min(10),
    id_cola: Joi.string().min(6),
    id_negocio: Joi.string().min(6),
    id_tiempo_estimado: Joi.string().min(2),
    nombre: Joi.string().min(4)
  };
  return Joi.validate(servicio, schema);
}

/**********************************************************************************************************/
//crudCola
//get one Cola, mandando ID==========================

appCola1.get("/gC/:id", (req, res) => {
  const colas = firebase.database().ref("/cola"); // Referencia a la base de datos
  colas.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        res.send(childSnapshot.val());
      }
    });
  });
});
exports.getColaById = functions.https.onRequest(appCola1);

//Get all desde tabla negocio==================================

appCola2.get("/gC", (req, res) => {
  const colas = firebase.database().ref("/cola"); // Referencia a la base de datos
  colas.on("value", snapshot => {
    res.json(snapshot.val());
  });
});
exports.getColas = functions.https.onRequest(appCola2);

//crear un turno nuevo en la tabla turno==============================

appCola3.post("/pC", (req, res) => {
  const colas = firebase.database().ref("/cola"),
    cola = req.body, // El objeto que mandamos.
    { error } = validateCola(cola); //valida el Negocio contra el esquema

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  colas
    .push(cola) // Crea un nuevo objeto con ID aleatorio.
    .then(res.json(cola))
    .catch(err => res.json(err));
});
exports.postCola = functions.https.onRequest(appCola3);

//editar turno existente=================================================

appCola4.put("/eC/:id", (req, res) => {
  const colas = firebase.database().ref("/cola");
  const cola = req.body; // El objeto que mandamos.
  const { error } = validateServicio(cola);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  colas.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        if (req.body.nombre) {
          childSnapshot.ref.update({ nombre: req.body.nombre });
        }
        if (req.body.id_sucursal) {
          childSnapshot.ref.update({
            id_sucursal: req.body.id_sucursal
          });
        }
        if (req.body.activo) {
          childSnapshot.ref.update({ activo: req.body.activo });
        }
        if (req.body.descripcion) {
          childSnapshot.ref.update({ descripcion: req.body.descripcion });
        }
        if (req.body.id_negocio) {
          childSnapshot.ref.update({ id_negocio: req.body.id_negocio });
        }
        res.send(childSnapshot);
      }
    });
  });
});
exports.editCola = functions.https.onRequest(appCola4);

//Cancelar un negocio existente (no se borra, aparece como cancelado.)

appCola5.put("/can/:id", (req, res) => {
  const colas = firebase.database().ref("/cola");
  colas.on("value", snapshot => {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      if (key === req.params.id) {
        childSnapshot.ref.update({ activo: "false" });
        res.send(childSnapshot);
      }
    });
  });
});
exports.cancelCola = functions.https.onRequest(appCola5);

function validateCola(cola) {
  const schema = {
    activo: Joi.string().min(4),
    descripcion: Joi.string().min(10),
    id_negocio: Joi.string().min(6),
    id_sucursal: Joi.string().min(6),
    nombre: Joi.string().min(4)
  };
  return Joi.validate(cola, schema);
}
