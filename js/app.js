const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


// == Crear un Promise ==
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    // En caso de que el Promise sea correcto, dara un resolver
    resolve(criptomonedas)
})

// == Funciones al cargar el DOM ==
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario)

    monedaSelect.addEventListener('change', leerValor)
    criptomonedasSelect.addEventListener('change', leerValor)
})

async function consultarCriptomonedas() {
    
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        const criptomonedas = await obtenerCriptomonedas(resultado.Data)
        selectCriptomonedas(criptomonedas)
    } catch (error) {
        console.log(error);
    }
    // fetch(url)
    //     .then( respuesta => respuesta.json() )
    //     .then( resultado => obtenerCriptomonedas(resultado.Data))
    //     .then( criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        // console.log(cripto);
        const {FullName, Name} = cripto.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName
        criptomonedasSelect.appendChild(option)
    })
}

function leerValor(e) {

    // Pasa en automatico la integracion por que el objeto recivido 
    // tiene el name de el elemento a modificar
    objBusqueda[e.target.name] = e.target.value

    console.log(objBusqueda);

}

function submitFormulario(e) {
    e.preventDefault()

    const { moneda , criptomoneda } = objBusqueda

    if (moneda === '' || criptomoneda === '') {
        mostarAlerta('Ambos valores son necesarios')
        return
    }

    consultarApi()
    // Consultar API con los resultados 
}

function mostarAlerta(mensaje) {
    
    const existeError = document.querySelector('.error')
    if (!existeError) {
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('error')

        divMensaje.textContent = mensaje

        formulario.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }
    
}

async function consultarApi() {
    const { moneda , criptomoneda } = objBusqueda

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        imprimirResultado(resultado.DISPLAY[criptomoneda][moneda])
    } catch (error) {
        console.log(error);
    }

    // fetch(url)
    //     .then( response => response.json())
    //     .then( cotizacion  => { imprimirResultado(cotizacion.DISPLAY[criptomoneda][moneda]) })
}

function imprimirResultado(cotizado) {
    mostrarSpinner()
    setTimeout(() => {
        limpiarHTML()
    
        const {PRICE, HIGHDAY, LOWDAY} = cotizado

        const h2Parrafo = document.createElement('h2')
        h2Parrafo.innerHTML = `Precio Actual <span>${PRICE}</span>`

        const pMax = document.createElement('p')
        pMax.innerHTML = `Maximo del Dia <span>${HIGHDAY}</span>`

        const pMin = document.createElement('p')
        pMin.innerHTML = `Minimo del Dias <span>${LOWDAY}</span>`

        resultado.appendChild(h2Parrafo)
        resultado.appendChild(pMax)
        resultado.appendChild(pMin)
    }, 2000);
    

    

}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.firstChild.remove()
    }
}

function mostrarSpinner() {

    limpiarHTML()

    const spinner = document.createElement('div')
    spinner.classList.add('sk-cube-grid')

    spinner.innerHTML = `
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
    `
    
    resultado.appendChild(spinner)
}