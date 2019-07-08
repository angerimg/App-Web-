function crearCustomers(id_sucursal, horaInicioServ, tiempoCalculado) {
    var customers = [];
    const turnos = firebase.database().ref("/turno");
    const usuarios = firebase.database().ref("/usuario");

    let listaUsuario = {};
    usuarios.on("value", snapshot => {
        snapshot.forEach(function(childSnapshot) {
            let keys = childSnapshot.key;
            listaUsuario = Object.assign({
                    [keys]: childSnapshot.val()
                },
                listaUsuario
            );
        });
    });

    turnos.on("value", snapshot => {
        snapshot.forEach(function(childSnapshot) {
            let keys = childSnapshot.key;
            if (
                childSnapshot.child("id_sucursal").val() === id_sucursal &&
                childSnapshot.child("activo").val() === "true"
            ) {
                customers.push({
                    [childSnapshot.child("hora_pedido").val()]: {
                        ["id_turno"]: keys,
                        ["name"]: listaUsuario[childSnapshot.child("id_usuario").val()]["nombre"],
                        ["beingServed"]: false,
                        ["behindName"]: "",
                        ["dateStartedService"]: horaInicioServ,
                        ["calculatedTime"]: "",
                        ["calculatedQueuePosition"]: "",
                        ["servicesTime"]: tiempoCalculado
                    }
                });
            }
        });
    });
}

function estimatedTimeLeft(customer) {
    const fecha = new Date();
    if (customer["dateStartedService"].val() === null) {
        return customer["servicesTime"].val();
    } else {
        return (
            customer["servicesTime"].val() -
            (fecha.getTime() - customer["dateStartedService"].val()) / 1000
        );
    }
}

function extract(servers) {
    let ilTriello = [];
    for (i = 0; i < waiting.length && i < servers; i++) {
        ilTriello.push(waiting[i]);
    }
    return ilTriello;
}

function updateQueue(servers) {
    var beingServed = customers.filter(c => c["beingServed"].val());
    var waiting = customers.filter(c => !c["beingServed"].val());
    updateBeingServed();

    let back = extract(waiting, servers);
    back.forEach(item => {
        waiting.splice(waiting.indexOf(item), 1);
    });
    var front = beingServed;

    updateWaiting(back, front);

    while (!(waiting.length === 0)) {
        front = back;
        back = extract(servers);
        back.forEach(item => {
            waiting.splice(waiting.indexOf(item), 1);
        });
        updateWaiting(back, front);
    }
}

function updateBeingServed() {
    beingServed.forEach(c => {
        c["calculatedQueuePosition"] = 0;
        c["calculatedTime"] = estimatedTimeLeft(c);
    });
}

function updateWaiting() {
    waiting.forEach(item => {
        let next = popLowest();
        item["calculatedQueuePosition"] = next["calculatedQueuePosition"] + 1;
        item["calculatedTime"] = estimatedTimeLeft(item) + next["calculatedTime"];
        item["behindName"] = next["name"].val();
    });
}

function popLowest() {
    if (front.length <= 0) {
        return null;
    }
    let menor = 999999;
    let customer = null;

    front.forEach(item => {
        if (item["calculatedTime"].val() < menor) {
            menor = item["calculatedTime"].val();
            customer = item;
        }
    });
    front.splice(waiting.indexOf(customer), 1);
    return customer;
}
var servers = 2;
let cont = 0;
var customers = [];
customers.push({
    [cont++]: {
        ["id_turno"]: "15256",
        ["name"]: "a",
        ["beingServed"]: false,
        ["behindName"]: "",
        ["dateStartedService"]: null,
        ["calculatedTime"]: "",
        ["calculatedQueuePosition"]: "",
        ["servicesTime"]: 200
    }
});

customers.push({
    [cont++]: {
        ["id_turno"]: "1556",
        ["name"]: "b",
        ["beingServed"]: false,
        ["behindName"]: "",
        ["dateStartedService"]: null,
        ["calculatedTime"]: "",
        ["calculatedQueuePosition"]: "",
        ["servicesTime"]: 100
    }
});

customers.push({
    [cont++]: {
        ["id_turno"]: "152996",
        ["name"]: "c",
        ["beingServed"]: false,
        ["behindName"]: "",
        ["dateStartedService"]: null,
        ["calculatedTime"]: "",
        ["calculatedQueuePosition"]: "",
        ["servicesTime"]: 100
    }
});

customers.push({
    [cont++]: {
        ["id_turno"]: "152696",
        ["name"]: "d",
        ["beingServed"]: false,
        ["behindName"]: "",
        ["dateStartedService"]: null,
        ["calculatedTime"]: "",
        ["calculatedQueuePosition"]: "",
        ["servicesTime"]: 50
    }
});

customers.push({
    [cont++]: {
        ["id_turno"]: "15256ff",
        ["name"]: "e",
        ["beingServed"]: false,
        ["behindName"]: "",
        ["dateStartedService"]: null,
        ["calculatedTime"]: "",
        ["calculatedQueuePosition"]: "",
        ["servicesTime"]: 70
    }
});

updateQueue(servers);
customers.forEach(item => {
    console.log(
        `customer:${item["name"].val()}  
        ${item["calculatedQueuePosition"].val()}
        ${item["calculatedTime"].val()} 
        ${item["behindName"].val()}`
    );
});