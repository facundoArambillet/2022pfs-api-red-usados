let pSubtitulo = document.querySelector("#pSubtitulo");
pSubtitulo.innerHTML="Ejemplo Concesionaria - un vehiculo";

let parametros = [];
function procesarParametros() {
    parametros = [];
    let parStr = window.location.search.substr(1);
    let parArr = parStr.split("&");
    for (let i = 0; i < parArr.length; i++) {
        let par = parArr[i].split("=");
        parametros[par[0]] = par[1];
    }
}

load();

////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function load() {
    try {
        vehiculos = [];
        procesarParametros();
        let url = `/vehiculo/${parametros['dominio']}`;
        let respuesta = await fetch(url);
        if (respuesta.ok) {
            let vehiculo = await respuesta.json();
            document.querySelector("#pTitulo").innerHTML = `Vehiculo: ${vehiculo['dominio']}`;
            document.querySelector("#pSubtitulo").innerHTML="Ejemplo de registro unico en Form";
            // document.querySelector('#dominio').value = vehiculo['dominio'];
            document.querySelector('#marca').value = vehiculo['marca'];
            document.querySelector('#modelo').value = vehiculo['modelo'];
            document.querySelector('#año').value = vehiculo['año'];
            document.querySelector('#precio').value = vehiculo['precio'];
            if (vehiculo['capacidad']==undefined)
                document.querySelector('#capacidad').value = "-"
            else
                document.querySelector('#capacidad').value = vehiculo['capacidad'];
            document.querySelector('#acciones').innerHTML = `
            <button class="btnDelVehiculo" dominio="${vehiculo['dominio']}">Borrar</button>
            <button class="btnUpdVehiculo" dominio="${vehiculo['dominio']}">Actualizar</button>
            <a href="usados.html">Regresar</a>
            `;
            let btnBorrar = document.querySelector('.btnDelVehiculo');
            btnBorrar.addEventListener('click', async () => {
                let dominio = this.getAttribute('dominio');
                if (await aServidor(dominio,'D')) {
                    document.querySelector('#acciones').innerHTML=`
                <a href="ejemploVehiculos.html">Regresar</a>
                    `;
                }    
            });
            let btnModificar = document.querySelector('.btnUpdVehiculo');
            btnModificar.addEventListener('click', async () => {
                let dominio = btnModificar.attributes['dominio'].value;
                let renglon = {
                    "cantidad" : 1,
                    "vehiculos" : [
                        {
                            "tipo" : `${(document.querySelector('#capacidad').value=='-')?'Auto':'Camioneta'}`,
                            "dominio" : vehiculo['dominio'],
                            "marca" : document.querySelector('#marca').value,
                            "modelo" : document.querySelector('#modelo').value,
                            "año" : document.querySelector('#año').value,
                            "precio" : document.querySelector('#precio').value,
                            "capacidad" : document.querySelector('#capacidad').value
                        }
                    ]
                }        
                if (await aServidor(renglon,'U')) {
                    document.querySelector('#acciones').innerHTML=`
                <a href="ejemploVehiculos.html">Regresar</a>
                    `;
                }    
            });
        } else {
            document.querySelector("#pTitulo").innerHTML = `ERROR - Fallo URL`;
        }
    } catch (error) {
        document.querySelector("#pTitulo").innerHTML = `ERROR - Fallo en Conexion`;    
    }
}


async function aServidor(datos, accion) {
    let respuesta;
    switch (accion) {
        case 'D' : {    //ELIMINACION
            respuesta = await fetch(`/vehiculo/${datos}`, {
                method : 'DELETE'
            });   
            break;         
        }
        case 'U': {     //ACTUALIZACION
            respuesta = await fetch(`/vehiculo/${datos.vehiculos[0].dominio}`, {
                method : 'PUT',
                headers : { 'Content-type' : 'application/json' },
                body : JSON.stringify(datos)
            });
            break;
        }
    }
    return ((await respuesta.text()) == "ok");
}