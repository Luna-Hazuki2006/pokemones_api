let url = 'https://pokeapi.co/api/v2/pokemon/'
const paginas = document.getElementById('paginacion')
const lista = document.getElementById('lista')
let original = []
let objetosCompletos = []

async function obtenerTodos() {
    if (comprobar()) {
        cargar()
        return
    }
    obtenerListas()
}

async function obtenerListas() {
    let objetos = []
    objetosCompletos = []
    const respuesta = await fetch(url)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    original = data
    objetos = data['results']
    for (const dato of objetos) {
        await obtenerDetalles(dato)
    }
    almacenar()
    cargar()
}

async function obtenerDetalles(dato) {
    const respuesta = await fetch(dato['url'])
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    // const habilidades = [...data['abilities']]
    // const items = [...data['held_items']]
    // const movimientos = [...data['moves']]
    // const estadisticas = [...data['stats']]
    // const tipos = [...data['types']]
    // for (let i = 0; i < movimientos.length; i++) {
    //     movimientos[i] = movimientos[i]['move']
    // }
    // const pokemon = {
    //     nombre: data['name'], 
    //     altura: data['height'], 
    //     peso: data['weight'], 
    //     items: items, 
    //     movimientos: movimientos, 
    //     habilidades: habilidades, 
    //     estadisticas: estadisticas, 
    //     tipos: tipos
    // }
    objetosCompletos.push(data)
}

function almacenar() {
    const pokemones = JSON.stringify(objetosCompletos)
    localStorage.setItem('pokemones', pokemones)
    const lista = json.stringify(original)
    localStorage.setItem('lista', lista)
}

function comprobar() {
    if (localStorage.getItem('pokemones') && 
        localStorage.getItem('lista')) {
        let revisar = JSON.parse(localStorage.getItem('pokemones'))
        let lista = JSON.parse(localStorage.getItem('lista'))
        if (revisar != [] && lista != []) {
            objetosCompletos = revisar
            original = lista
            return true
        }
        return false
    } else {
        return false
    }
}

function cargar() {
    let cosas = Object.keys(objetosCompletos[0])
    console.log(cosas);
    console.log(objetosCompletos[19]);
    let flecha = document.querySelector('#paginacion a:first-child')
    limpiar()
    for (let i = objetosCompletos.length - 1; i >= 0; i--) {
        let dato = document.createElement('a')
        let id = objetosCompletos[i]['id']
        dato.innerText = id
        dato.id = id
        dato.href = '#' + id
        dato.addEventListener('click', () => {
            let muchos = document.querySelectorAll('#lista div')
            muchos.forEach((esto) => {
                if (esto.id != id) {
                    esto.classList.add('invisible')
                } else {
                    esto.classList.remove('invisible')
                }
            })
            muchos = document.querySelectorAll('#paginacion a')
            muchos.forEach((esto) => {
                if (esto.id != id) {
                    esto.classList.remove('activa')
                } else {
                    esto.classList.add('activa')
                }
            })
        })
        flecha.after(dato)
    }
    let anterior = document.querySelector('.flechas:first-of-type')
    if (!original['previous']) {
        anterior.removeEventListener('click')
    } else {
        anterior.addEventListener('click', () => {
            url = original['previous']
            obtenerListas()
        })
    }
    anterior.addEventListener()
    let siguiente = document.querySelector('.flechas:last-of-type')
    if (!original['next']) {
        siguiente.removeEventListener('click')
    } else {
        siguiente.addEventListener('click', () => {
            url = original['next']
            obtenerListas()
        })
    }
    for (const esto of objetosCompletos) {
        let caso = document.createElement('div')
        caso.id = esto['id']
        caso.classList.add('invisible')
        let p = document.createElement('p')
        p.innerText = 'Nombre: ' + esto['name']
        caso.appendChild(p)
        p = document.createElement('p')
        p.innerText = 'Peso: ' + esto['weight']
        caso.appendChild(p)
        p = document.createElement('p')
        p.innerText = 'Altura: ' + esto['height']
        caso.appendChild(p)
        p = document.createElement('p')
        p.innerText = 'Experiencia base: ' + esto['base_experience']
        caso.appendChild(p)
        p = document.createElement('p')
        p.innerText = 'Por defecto: ' + ((esto['is_default']) ? 'Si' : 'No')
        caso.appendChild(p)
        p = document.createElement('p')
        if ([...esto['types']].length > 1) {
            p.innerText = 'Tipos: '
            let ul = document.createElement('ul')
            for (const uno of [...esto['types']]) {
                let li = document.createElement('li')
                li.innerText = uno['type']['name']
                ul.appendChild(li)
            }
            caso.appendChild(p)
            caso.appendChild(ul)
        } else {
            p.innerText = 'Tipo: ' + esto['types'][0]['type']['name']
            caso.appendChild(p)
        }
        p = document.createElement('p')
        if ([...esto['held_items']].length == 0) {
            p.innerText = 'Items sostenidos: ninguno'
            caso.appendChild(p)
        } else {
            p.innerText = 'Items sostenidos: '
            let ul = document.createElement('ul')
            for (const uno of [...esto['held_items']]) {
                let li = document.createElement('li')
                li.innerText = uno['item']['name']
                ul.appendChild(li)
            }
            caso.appendChild(p)
            caso.appendChild(ul)
        }
        p = document.createElement('p')
        p.innerText = 'Orden: ' + esto['order']
        caso.appendChild(p)
        p = document.createElement('p')
        p.innerText = 'Estadísticas: '
        caso.appendChild(p)
        let table = document.createElement('table')
        let tr = document.createElement('tr')
        let th = document.createElement('th')
        th.innerText = 'Nombre'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerText = 'Base'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerText = 'Esfuerzo'
        tr.appendChild(th)
        table.appendChild(tr)
        for (const uno of [...esto['stats']]) {
            tr = document.createElement('tr')
            let td = document.createElement('td')
            td.innerText = uno['stat']['name']
            tr.appendChild(td)
            td = document.createElement('td')
            td.innerText = uno['base_stat']
            tr.appendChild(td)
            td = document.createElement('td')
            td.innerText = uno['effort']
            tr.appendChild(td)
            table.appendChild(tr)
        }
        caso.appendChild(table)
        p = document.createElement('p')
        p.innerText = 'Habilidades: '
        caso.appendChild(p)
        table = document.createElement('table')
        tr = document.createElement('tr')
        th = document.createElement('th')
        th.innerText = 'Nombre'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerText = 'Oculta'
        tr.appendChild(th)
        table.appendChild(tr)
        for (const uno of [...esto['abilities']]) {
            tr = document.createElement('tr')
            let td = document.createElement('td')
            td.innerText = uno['ability']['name']
            tr.appendChild(td)
            td = document.createElement('td')
            td.innerText = (uno['is_hidden']) ? 'Si' : 'No'
            tr.appendChild(td)
            table.appendChild(tr)
        }
        caso.appendChild(table)
        p = document.createElement('p')
        p.innerText = 'Imágenes: '
        caso.appendChild(p)
        table = document.createElement('table')
        tr = document.createElement('tr')
        for (const uno of Object.keys(esto['sprites'])) {
            if (uno == 'other' || uno == 'versions') {
                continue
            }
            th = document.createElement('th')
            th.innerText = uno
            tr.appendChild(th)
        }
        table.appendChild(tr)
        tr = document.createElement('tr')
        for (const uno of Object.keys(esto['sprites'])) {
            if (uno == 'other' || uno == 'versions') {
                continue
            }
            let td = document.createElement('td')
            if (esto['sprites'][uno]) {
                let img = document.createElement('img')
                img.src = esto['sprites'][uno]
                td.appendChild(img)
            } else {
                td.innerText = 'no tiene'
            }
            tr.appendChild(td)
        }
        table.appendChild(tr)
        caso.appendChild(table)
        lista.appendChild(caso)
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