const url = 'https://pokeapi.co/api/v2/pokemon/'
const paginas = document.getElementById('paginacion')
let objetos = []
let objetosCompletos = []

async function obtenerTodos() {
    if (comprobar()) {
        cargar()
        return
    }
    objetos = []
    objetosCompletos = []
    const respuesta = await fetch(url)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    objetos = [...data['results']]
    console.log(muchos);
    for (const dato of objetos) {
        objetos.push(dato)
        await obtenerDetalles(dato)
    }
    console.log(objetos);
    almacenar()
}

async function obtenerDetalles(dato) {
    const respuesta = await fetch(dato['url'])
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    const habilidades = [...data['abilities']]
    const items = [...data['held_items']]
    const movimientos = [...data['moves']]
    const estadisticas = [...data['stats']]
    const tipos = [...data['types']]
    for (let i = 0; i < movimientos.length; i++) {
        movimientos[i] = movimientos[i]['move']
    }
    const pokemon = {
        nombre: data['name'], 
        altura: data['height'], 
        peso: data['weight'], 
        items: items, 
        movimientos: movimientos, 
        habilidades: habilidades, 
        estadisticas: estadisticas, 
        tipos: tipos
    }
    objetosCompletos.push(data)
}

function almacenar() {
    const pokemones = JSON.stringify(objetosCompletos)
    localStorage.setItem('pokemones', pokemones)
}

function comprobar() {
    if (localStorage.getItem('pokemones')) {
        let revisar = JSON.parse(localStorage.getItem('pokemones'))
        if (revisar != []) {
            objetosCompletos = revisar
            return true
        }
    }
    return false
}

function cargar() {
    let cosas = Object.keys(objetosCompletos[0])
    let flecha = document.querySelector('#paginacion a:first-child')
    limpiar()
    for (let i = objetosCompletos.length - 1; i >= 0; i--) {
        let dato = document.createElement('a')
        let id = objetosCompletos[i]['id']
        dato.innerText = id
        dato.id = id
        dato.href = '#' + id
        dato.addEventListener('click', () => {
            let muchos = document.querySelectorAll('#lista div:not(#' + id + ')')
            muchos.forEach((esto) => esto.classList.add('invisible'))
            let actual = document.getElementById(id)
            actual.classList.remove('invisible')
        })
        flecha.after(dato)
    }

}

function limpiar() {
    let borradas = document.querySelectorAll('#paginacion a:not(.flechas)')
    for (let i = borradas.length - 1; i >= 0; i--) {
        paginas.removeChild(borradas[i])
    }
}

function flitrar() {
    
}

obtenerTodos()