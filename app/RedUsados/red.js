let pTitulo = document.querySelector("#pTitulo");
let pSubtitulo = document.querySelector("#pSubtitulo");
let btnAgregar = document.querySelector("#btnAgregar");
let btnBuscar = document.querySelector("#btnBuscar");

let redes = [];
load();

btnAgregar.addEventListener("click", async () => {
    console.log("Función Agregar");
    let sede = document.querySelector('#sede').value;
    let marca = document.querySelector('#marca').value;
    let modelo = document.querySelector('#modelo').value;
    let año = parseInt(document.querySelector('#año').value);
    let precio = parseInt(document.querySelector('#precio').value);
    let capacidad = parseInt(document.querySelector('#capacidad').value);
    let tipo = 'Auto';
    if (capacidad) {
        tipo = 'Camioneta';    
    }
    let renglon = {
        "cantidad" : 1,
        "redes" : [
            {
                "tipo" : tipo,
                "dominio" : dominio,
                "marca" : marca,
                "modelo" : modelo,
                "año" : año,
                "precio" : precio,
                "capacidad" : capacidad
            }
        ]
    };
    if (await aServidor(renglon,'A')) {
        load();
    }
    document.querySelector('#dominio').value="";
    document.querySelector('#marca').value="";
    document.querySelector('#modelo').value="";
    document.querySelector('#año').value="";
    document.querySelector('#precio').value="";
    document.querySelector('#capacidad').value="";
});
btnBuscar.addEventListener("click", () => {
    console.log("Función Buscar");
    let dominio = document.querySelector('#dominio').value.toUpperCase();
    if (dominio) 
        load(dominio);
    else
        load();
    document.querySelector('#dominio').value="";
})
btnBuscaA.addEventListener("click", () => {
    console.log("Función Buscar Autos");
    load('A')
})
btnBuscaC.addEventListener("click", () => {
    console.log("Función Buscar Camionetas");
    load('C')
})

function mostrarVehiculos() {
    let html = "";
    for (let r of redes) {
        html += `
            <tr>
            <td><a href="./usado.html?dominio=${r.dominio}">${r.dominio}</a></td>
            <td>${r.marca}</td>
            <td>${r.modelo}</td>
            <td>${r.año}</td>
            <td>${r.precio}</td>
            <td>${(r.capacidad==undefined)?"-":r.capacidad}</td>
            <td>${(r.sede==undefined)?"-":r.sede}</td>
            </tr>
        `; 
    }
    document.querySelector("#tblVehiculos").innerHTML = html;
}

async function load(dominio) {
    redes = [];
    let url = "";
    switch (dominio) {
        case 'A': {
                url = `/vehiculo/autos`;
                dominio = '';
                break;
            }
        case 'C': {
                url = `/vehiculo/camionetas`;
                dominio = '';
                break;
            }
        default: {
                if (dominio) 
                    url = `/vehiculo/${dominio}`;
                else
                    url = '/vehiculo';            
                break;
            }
    }
    let respuesta = await fetch(url);
    if (respuesta.ok) {
        if (dominio) 
            redes.push(await respuesta.json());
        else
            redes = await respuesta.json();
    }
    mostrarVehiculos()
}

async function aServidor(datos, accion) {
    let respuesta;
    switch (accion) {
        case 'A': {     //ALTA
            respuesta = await fetch('/vehiculo', {
                method :'POST',
                headers: { 'Content-Type' : 'application/json' },
                body : JSON.stringify(datos)
            });
            break;
        } 
        case 'D' : {    //ELIMINACION
            respuesta = await fetch(`/vehiculo/${dominio}`, {
                method : 'DELETE'
            });   
            break;         
        }
        case 'U': {     //ACTUALIZACION
            respuesta = await fetch(`/vehiculo/${datos.redes[0].dominio}`, {
                method : 'PUT',
                headers : { 'Content-type' : 'application/json' },
                body : JSON.stringify(datos)
            });
            break;
        }
    }
    return ((await respuesta.text()) == "ok");
}