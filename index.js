const url = 'https://pokeapi.co/api/v2/pokemon/'
const objetos = []
const objetosCompletos = []

async function obtenerTodos() {
    if (comprobar()) {
        cargar()
        return
    }
    objetos.length = 0
    objetosCompletos.length = 0
    const respuesta = await fetch(url)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    const muchos = [...data['results']]
    console.log(muchos);
    for (const dato of muchos) {
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
    objetos.push(pokemon)
}

function almacenar() {
    const pokemones = JSON.stringify(objetosCompletos)
    localStorage.setItem('pokemones', pokemones)
}

function comprobar() {
    if (localStorage.getItem('pokemones')) {
        let revisar = JSON.parse(localStorage.getItem('pokemones'))
        if (revisar != []) {
            return true
        }
    }
    return false
}

function cargar() {
    
}

function flitrar(params) {
    
}

obtenerTodos()