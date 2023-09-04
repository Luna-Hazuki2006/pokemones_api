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
    await obtenerListas()
}

async function obtenerListas() {
    let objetos = []
    original = []
    objetosCompletos = []
    const respuesta = await fetch(url)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    original = await respuesta.json()
    objetos = original['results']
    for (const dato of objetos) {
        await obtenerDetalles(dato)
    }
    almacenar()
    await cargar()
}

async function obtenerDetalles(dato) {
    const respuesta = await fetch(dato['url'])
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    objetosCompletos.push(data)
}

function almacenar() {
    console.log('por aqui');
    const pokemones = JSON.stringify(objetosCompletos)
    console.log(objetosCompletos);
    localStorage.setItem('pokemones', pokemones)
    const listado = JSON.stringify(original)
    console.log(original);
    localStorage.setItem('lista', listado)
}

function comprobar() {
    if (localStorage.getItem('pokemones') && 
        localStorage.getItem('lista')) {
        let revisar = JSON.parse(localStorage.getItem('pokemones'))
        let listado = JSON.parse(localStorage.getItem('lista'))
        if (revisar != [] && listado != []) {
            objetosCompletos = revisar
            original = listado
            return true
        }
        return false
    } else {
        return false
    }
}

async function cargar() {
    lista.innerHTML = ''
    let flecha = document.querySelector('#paginacion a:first-child')
    limpiar()
    let muchos = Object.keys(objetosCompletos[0])
    console.log(muchos);
    console.log(objetosCompletos[0]);
    for (let i = objetosCompletos.length - 1; i >= 0; i--) {
        let dato = document.createElement('a')
        let id = objetosCompletos[i]['id']
        dato.innerText = id
        dato.id = 'a' + id
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
                if (esto.id != ('a' + id)) {
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
        anterior.addEventListener('click', () => {})
    } else {
        anterior.addEventListener('click', async () => {
            if (original['previous']) {
                url = original['previous']
                await obtenerListas()   
            }
        })
    }
    let siguiente = document.querySelector('.flechas:last-of-type')
    if (!original['next']) {
        siguiente.addEventListener('click', () => {})
    } else {
        siguiente.addEventListener('click', async () => {
            if (original['next']) {
                url = original['next']
                await obtenerListas()   
            }
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
        p = document.createElement('p')
        if ([...esto['moves']].length > 0) {
            p.innerText = 'Movimientos: '
            let ul = document.createElement('ul')
            for (const uno of [...esto['moves']]) {
                let li = document.createElement('li')
                li.innerText = uno['move']['name']
                ul.appendChild(li)
            }
            caso.appendChild(p)
            caso.appendChild(ul)
        } else {
            p.innerText = 'Movimientos: no tiene'
            caso.appendChild(p)
        }
        p = document.createElement('p')
        let movimientos = await obtenerMovimientos(esto['location_area_encounters'])
        if (movimientos.length > 0) {
            p.innerText = 'Lugares de encuentro: '
            let ul = document.createElement('ul')
            for (const uno of movimientos) {
                let li = document.createElement('li')
                li.innerText = uno['location_area']['name']
                ul.appendChild(li)
            }
            caso.appendChild(p)
            caso.appendChild(ul)
        } else {
            p.innerText = 'Lugares de encuentro: no tiene'
            caso.appendChild(p)
        }
        lista.appendChild(caso)
    }
}

async function obtenerMovimientos(campo) {
    const respuesta = await fetch(campo)
    if (!respuesta.ok) {
        throw new Error(respuesta.statusText)
    }
    const data = await respuesta.json()
    return [...data]
}

function limpiar() {
    let borradas = document.querySelectorAll('#paginacion a:not(.flechas)')
    for (let i = borradas.length - 1; i >= 0; i--) {
        paginas.removeChild(borradas[i])
    }
}

function filtrar() {
    console.log('incluso aqui');
    let filtrado = document.getElementById('filtrado').value
    let ver = []
    for (const esto of objetosCompletos) {
        if (String(esto['name']).includes(filtrado)) {
            console.log(esto['name']);
            let pokemon = document.getElementById(esto['id'])
            ver.push(pokemon)
        }
    }
    let todos = document.querySelectorAll('#lista div')
    for (const esto of todos) {
        if (ver.indexOf(esto) == -1) {
            esto.classList.add('invisible')
        } else {
            esto.classList.remove('invisible')
        }
    }
}

obtenerTodos()