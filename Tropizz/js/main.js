/**
 * Получение данных пользователя из временного хранилища
 * @type {any}
 */
const user = JSON.parse(sessionStorage.getItem('user'))

/**
 * Ссылки и меню на навигационной панели
 * @type {Element}
 */
const menuIcon = document.querySelector('#hiddenMenu')
const hiddenMenu = document.querySelector('#hiddenMenu > ul')

/**
 * Рисунок волны в конце страницы
 * @type {Element}
 */
const waveImg = document.querySelector('.wave')
waveImg?.setAttribute('loading', 'lazy')

/**
 * Установка времени готовки
 */
const setTimeOfOrder = () => {
    const date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    if (+minutes + 15 >= 60) {
        hours = +hours + 1
        minutes = +minutes - 45
    } else {
        minutes = +minutes + 15
    }
    hours = `${hours}`.length === 1 ? `0${hours}` : `${hours}`
    minutes = `${minutes}`.length === 1 ? `0${minutes}` : `${minutes}`
    const localTime = `${hours}:${minutes}`
    sessionStorage.setItem('firstOrderTime', localTime)
}

/**
 * Места картинок продуктов
 */
const productsImages = Array.from(document.querySelectorAll('.cardImg img'))

/**
 * Установка заднего фона продукта
 */
const bgDiv = document.querySelector('.imagePart')
if (bgDiv) {
    const urlImage = bgDiv?.querySelector('img').src
    bgDiv.style.backgroundImage = `url(${urlImage})`
}

/**
 * Кнопка для прокрутки вверх
 * @type {Element}
 */
const goTopBtn = document.querySelector('#goTopBtn')

/**
 * Кнопки для входа и регистрации
 * @type {NodeListOf<Element>}
 */
const authAndAccountLinks = document.querySelectorAll('.authAndAccount')

const userNameInput = document.querySelector('#userName')
const userEmailInput = document.querySelector('#email')
if (userNameInput && userEmailInput) {
    userNameInput.value = user?.username ?? ''
    userEmailInput.value = user?.email ?? ''
}

/**
 * Функция для получения URL
 * @return {string}
 */
const getCurrentPageLocation = () => {
    const slashIndex = window.location.href.lastIndexOf('/')
    const dotHtmlIndex = window.location.href.indexOf('.html')

    return window.location.href.slice(slashIndex, dotHtmlIndex)
}

/**
 * Кнопка и часть отображения корзинки на сайте
 * @type {Element}
 */
const addToCartBtn = document.querySelector('.addToCart')
const cartContainer = document.querySelector('#cart')

/**
 * Логика заказа
 * @type {Element}
 */
const firstOrderTime = document.querySelector('.firstOrderTime input')
const sessionFirstOrderTime = sessionStorage.getItem('firstOrderTime')
const orderProductsBtn = document.querySelector('.orderProducts')

const checkCart = () => {
    const cart = JSON.parse(sessionStorage.getItem('cart'))
    if ((!cart || Object.keys(cart).length === 0) && getCurrentPageLocation() === '/user') {
        orderProductsBtn.disabled = true
        firstOrderTime.disabled = true
    }
    if ((cart && Object.keys(cart).length !== 0) && firstOrderTime) {
        orderProductsBtn.disabled = false
        firstOrderTime.disabled = false
    }
    if (sessionFirstOrderTime && firstOrderTime) firstOrderTime.value = sessionFirstOrderTime

    const sessionCart = JSON.parse(sessionStorage.getItem('cart'))
    if (firstOrderTime && (sessionCart && Object.keys(sessionCart).length === 0)) {
        sessionStorage.setItem('firstOrderTime', '')
        firstOrderTime.value = ''
    }
}

if (getCurrentPageLocation() === '/user') {
    setTimeOfOrder()
    checkCart()
}

firstOrderTime?.addEventListener('change', e => sessionStorage.setItem('firstOrderTime', e.target.value))

/**
 * Кнопка увеличения и уменьшения кол-ва заказа
 */
const orderNumberInputs = document.querySelectorAll('.cardOrderNumber input')

orderNumberInputs.forEach(el => {
    el?.addEventListener('change', e => {
        const number = e.target.value
        const orderName = el.parentElement.classList[1]

        if (+number < 0 || +number > 20) {
            el.value = 0
            return
        }

        const cart = JSON.parse(sessionStorage.getItem('cart') ?? '{}')
        sessionStorage.setItem('cart', JSON.stringify({...cart, [orderName]: number}))
        setTimeOfOrder()

        if (+number === 0) {
            delete cart[orderName]
            sessionStorage.setItem('cart', JSON.stringify(cart))
        }
    })

    checkCart()
})

/**
 * Установка всех количеств заказа на странице каталога
 */
const checkInputsNumbers = () => {
    const cart = JSON.parse(sessionStorage.getItem('cart') ?? '{}')

    if (Object.values(cart).length === 0) return

    Object.entries(cart).forEach(entry => {
        orderNumberInputs.forEach(input => {
            const closes = input.closest(`.${entry[0]}`)
            if (closes) {
                input.value = entry[1]
            }
        })
    })
}
checkInputsNumbers()

/**
 * Установка медленной загрузки картинок
 */
productsImages?.splice(0, 7).forEach(el => el.setAttribute('loading', 'lazy'))

/**
 * Загрузка иконок через библиотеку "Feather"
 */
feather.replace()

/**
 * Меню при использовании мобильных телефонов
 */
menuIcon.addEventListener('click', e => {
    hiddenMenu.classList.toggle('hide')
    menuIcon.querySelector('svg').classList.toggle('clicked')
})

/**
 * Анимация прокрутки вверх
 */
const goTopBtnAnimation = () => {
    if (window.scrollY <= window.innerHeight / 2) {
        goTopBtn.classList.add('hide')
        setTimeout(() => {
            goTopBtn.style.opacity = '0'
        }, 500)
    } else {
        goTopBtn.classList.remove('hide')
        setTimeout(() => {
            goTopBtn.style.opacity = '1'
        }, 500)
    }
}
goTopBtnAnimation()

/**
 * Кнопка прокрутки вверх
 */
window.addEventListener("scroll", goTopBtnAnimation)
goTopBtn.addEventListener('click', () => {
    window.scrollTo(0, 0)
})

/**
 * Если пользователь вошёл в аккаунт, добавление ссылки в навигационную панель
 */
if (user) {
    authAndAccountLinks.forEach(link => {
        const index = user.email.indexOf('@')
        link.innerHTML = user.email.slice(0, index)
        link.href = '/Tropizz/pages/user.html'
    })
} else {
    const signOutBtns = document.querySelectorAll('.signOut')
    signOutBtns.forEach(btn => {
        btn.parentElement.remove()
    })
}

/**
 * Если пользователь вошёл в аккаунт, меняет стили навигационны=ой панели
 */
if (getCurrentPageLocation() === '/user') {
    authAndAccountLinks.forEach(link => {
        link.classList.add('active')
    })
} else {
    authAndAccountLinks.forEach(link => {
        link.classList.remove('active')
    })
}

/**
 * Обновление кол-во продукта на каждой странице продукта
 */
const updateNumberOfProduct = () => {
    const cart = JSON.parse(sessionStorage.getItem('cart') ?? '{}')
    const number = document.querySelector('.numberInCart .number')
    if (cart && number) {
        number.innerHTML = cart[getCurrentPageLocation().slice(1)] ? cart[getCurrentPageLocation().slice(1)] : '0'
    }
}
updateNumberOfProduct()

/**
 * Добавление продукта в корзину и сохранение во временном хранилище
 */
addToCartBtn?.addEventListener('click', e => {
    e.preventDefault()
    const newItem = getCurrentPageLocation().slice(1)

    let cart = JSON.parse(sessionStorage.getItem('cart'))
    if (!cart || Object.keys(cart).length === 0)
        sessionStorage.setItem('cart', JSON.stringify({[newItem]: 1}))
    else {
        if (+cart[newItem] >= 20) return

        const newList = cart[newItem]
            ? {...cart, [newItem]: +cart[newItem] + 1}
            : {...cart, [newItem]: 1}

        sessionStorage.setItem('cart', JSON.stringify(newList))
    }

    setTimeOfOrder()
    updateNumberOfProduct()
    checkCart()
})

/**
 * Загрузка корзинки и показ списка на странице пользователя, если имеются
 */
if (cartContainer) {
    const cart = JSON.parse(sessionStorage.getItem('cart'))

    if (cart && Object.keys(cart).length !== 0) {
        const createElement = (tagName = 'div') => document.createElement(tagName)

        for (const arr of Object.entries(cart)) {
            const newProductElement = createElement()
            newProductElement.classList.add('productItem')

            const productName = createElement()
            productName.classList.add('productName')
            const h3 = createElement('h3')

            h3.innerHTML = arr[0]
            productName.appendChild(h3)

            const productNumber = createElement()
            productNumber.classList.add('productNumber')
            productNumber.innerHTML = arr[1]

            const deleteProductBtn = createElement('button')
            deleteProductBtn.classList.add('deleteProduct')
            deleteProductBtn.innerHTML = 'Удалить'

            newProductElement.appendChild(productName)
            newProductElement.appendChild(productNumber)
            newProductElement.appendChild(deleteProductBtn)

            cartContainer.appendChild(newProductElement)
        }
    }
}

/**
 * Кнопка и функция удаления продукта с корзинки
 */
const deleteProductBtns = document.querySelectorAll('.deleteProduct')

deleteProductBtns?.forEach(btn => {
    btn.addEventListener('click', e => {
        btn.disabled = true

        const closestParentName = btn.closest('.productItem').querySelector('.productName h3')
        const cart = JSON.parse(sessionStorage.getItem('cart'))
        delete cart[closestParentName.innerHTML]
        sessionStorage.setItem('cart', JSON.stringify(cart))

        checkCart()
        setTimeOfOrder()

        btn.disabled = false
        window.location.reload()
    })
})

checkCart()