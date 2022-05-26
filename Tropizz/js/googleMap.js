/**
 * Загрузка карты и добавление в html
 * @type {HTMLScriptElement}
 */
const script = document.createElement('script')
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPjYpXybcgGt7dXi0sMK-QXLOXyp11xLE&callback=initMap'
script.async = true

/**
 * Адреса действующих локации
 * @type {NodeListOf<Element>}
 */
const addresses = document.querySelectorAll('.addresses > *')
const myLocation = addresses[0]
const location1Btn = addresses[1]
const location2Btn = addresses[2]
const locations = [
    {lat: 51.09089545633141, long: 71.4184069633484},
    {lat: 51.135349093271884, long: 71.42571330070497}
]

let map
let lat = locations[0].lat
let long = locations[0].long

/**
 * Работа с анимации нажатия на разные карточки локации
 */
addresses.forEach(el => {
    el.addEventListener('click', () => {
        addresses.forEach(address => address.classList.remove('clickedLocation'))
        el.classList.add('clickedLocation')
    })
})

/**
 * Локация нахождения пользователя
 */
myLocation.addEventListener('click', async () => {
    await getCoords()
    initMap()
})

/**
 * Локация 1
 */
location1Btn.addEventListener('click', () => {
    lat = locations[0].lat
    long = locations[0].long
    initMap()
})

/**
 * Локация 2
 */
location2Btn.addEventListener('click', () => {
    lat = locations[1].lat
    long = locations[1].long
    initMap()
})

/**
 * Получение координат пользователя
 * @return {Promise<void>}
 */
const getCoords = async () => {
    await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
        .then(pos => {
            lat = pos.coords.latitude
            long = pos.coords.longitude
        })
}

/**
 * Отрисовка карты в html документе и обновление данных местоположения
 * @return {Promise<void>}
 */
async function initMap() {
    map = new google.maps.Map(document.querySelector("#map"), {
        center: {lat: +lat, lng: +long},
        zoom: 17,
    })
}

window.initMap = initMap

document.head.appendChild(script)