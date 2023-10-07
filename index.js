
const data = [
    {"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},
    {"id":51, "modelo":"DodgeViper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},
    {"id":67, "modelo":"Boeing CH-47 Chinook","anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},
    {"id":666, "modelo":"Aprilia RSV 1000 R","anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},
    {"id":872, "modelo":"Boeing 747-400", "anoFab":1989,"velMax":988, "altMax":13, "autonomia":13450},
    {"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953,"velMax":174, "altMax":3, "autonomia":870}
];

const fields = [
    {"id":"id", "name":"ID", "type":"number", "required":true},
    {"id":"modelo", "name":"Modelo", "type":"string", "required":true},
    {"id":"anoFab", "name":"Ano Fabricacion", "type":"string", "required":true},
    {"id":"velMax", "name":"Velocidad Maxima", "type":"number", "required":true},
    {"id":"altMax", "name":"Altura Maxima", "type":"number", "required":false},
    {"id":"autonomia", "name":"Autonomia", "type":"number", "required":false},
    {"id":"cantPue", "name":"Cantidad Puertas", "type":"number", "required":false},
    {"id":"cantRue", "name":"Cantidad Ruedas", "type":"number", "required":false}
];

class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id} - Modelo: ${this.modelo} - Año Fabricacion: ${this.anoFab} - Velocidad Maxima: ${this.velMax}`;
    }

    toJson() {
        return {
            id: this.id,
            modelo: this.modelo,
            anoFab: this.anoFab,
            velMax: this.velMax
        }
    }
}

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return super.toString() + ` - Altura Maxima: ${this.altMax} - Autonomia: ${this.autonomia}`;
    }

    toJson() {
        return {
            ...super.toJson(),
            altMax: this.altMax,
            autonomia: this.autonomia
        }
    }
}

class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return super.toString() + ` - Cantidad Puertas: ${this.cantPue} - Cantidad Ruedas: ${this.cantRue}`;
    }

    toJson() {
        return {
            ...super.toJson(),
            cantPue: this.cantPue,
            cantRue: this.cantRue
        }
    }
}

function ListarVehiculos() {
    const vehiculos = data.map(entidad => {
        if (entidad.autonomia) {
            return new Aereo(entidad.id, entidad.modelo, entidad.anoFab, entidad.velMax, entidad.altMax, entidad.autonomia);
        } else {
            return new Terrestre(entidad.id, entidad.modelo, entidad.anoFab, entidad.velMax, entidad.cantPue, entidad.cantRue);
        }
    });
    
    return vehiculos;
}

function FiltrarVehiculos(filtro) {
    const vehiculos = ListarVehiculos();
    let entidad;

    switch (filtro) {
        case 'Todos':
            entidad = vehiculos;
            break;
        case 'Aereos':
            entidad = vehiculos.filter(vehiculo => {
                return vehiculo instanceof Aereo;
            });
            break;
        case 'Terrestres':
            entidad = vehiculos.filter(vehiculo => {
                return vehiculo instanceof Terrestre;
            });
            break;
    }
    return entidad;
}

function GetFields() {
    return fields;
}

function GetPromedio(filtro) {
    const vehiculos = FiltrarVehiculos(filtro);
    const sumVelocidad = vehiculos.reduce((promedio, vehiculo) => {
        return promedio + vehiculo.velMax;
    }, 0);

    document.getElementById('input-read-only-promedio').value = sumVelocidad / vehiculos.length;
}

function CompletarTablaVehiculos(vehiculos, checkboxes = null) {    
    vehiculos.forEach(vehiculo => {
        const row = document.createElement('tr');
        const celdas = fields.map(field => {
            const celda = document.createElement('td');
            celda.id = field.id;
            celda.textContent = vehiculo[field.id] ? vehiculo[field.id] : '-';
            return celda;
        })

       
        let celdasFiltradas = celdas.filter(celda => {
            if (checkboxes?.length > 0) {
                let celdaFiltrada = checkboxes.find(checkbox => {
                    return checkbox.id === celda.id;
                });
                if (celdaFiltrada) {
                    return false;
                }
            }
            return true;
        });
        
        celdasFiltradas.forEach(celda => {
            row.appendChild(celda);
        });

        tableBody.appendChild(row);
    });
}

function ShowAbm() {
    const abm = document.getElementById('form-abm');
    abm.style.display === '' ? abm.style.display = 'none' : abm.style.display = '';

    const listado = document.getElementById('listado-vehiculos');
    listado.style.display === '' ? listado.style.display = 'none' : listado.style.display = '';
}

function GetRandomId() {
    return Math.floor(Math.random() * 200) + 1;
}

function AgregarVehiculo() {
    const tableBody = document.getElementById('tabla-vehiculos-body');

    const id = GetRandomId();
    const modelo = document.getElementById('modelo-vehiculo').value;
    const anoFab = document.getElementById('anoFab-vehiculo').value;
    const velMax = parseInt(document.getElementById('velMax-vehiculo').value);

    const selectTipoVehiculo = document.getElementById('abm-filtro-select').value;
    let vehiculo;
    
    if (selectTipoVehiculo !== 'Aereo' && selectTipoVehiculo !== 'Terrestre') {
        alert('Debe seleccionar un tipo de vehiculo');
        return;
    }
    else if (selectTipoVehiculo === 'Aereo') {
        const altMax = document.getElementById('altMax-vehiculo').value;
        const autonomia = document.getElementById('autonomia-vehiculo').value;
        vehiculo = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
    } else {
        const cantPue = document.getElementById('cantPue-vehiculo').value;
        const cantRue = document.getElementById('cantRue-vehiculo').value;
        vehiculo = new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
    }
            
    data.push(vehiculo.toJson());

    const vehiculos = ListarVehiculos();
    tableBody.innerHTML = '';
    CompletarTablaVehiculos(vehiculos);
    ShowAbm();
    LimpiarCampos();
}

function LimpiarCampos() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.value = '';
    });
}

function MostrarCheckboxes() {
    const checkboxes = document.getElementById('filtro-checkboxes');
    const checks = fields.map(field => {
        const div = document.createElement('div');
        const input = document.createElement('input');
        const label = document.createElement('label');

        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', `${field.id}`);
        input.setAttribute('value', field.name);
        input.setAttribute('checked', true);
        input.setAttribute('class', 'form-check-input');

        label.setAttribute('for', `${field.id}`);
        label.setAttribute('class', 'form-check-label');
        label.textContent = field.name;

        div.setAttribute('class', 'form-check form-check-inline');

        div.appendChild(input);
        div.appendChild(label);

        return div;
    })

    checks.forEach(check => {
        checkboxes.appendChild(check);
    });
}