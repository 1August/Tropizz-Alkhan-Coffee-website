/**
 * Загрузка иконок
 */
feather.replace()

/**
 * Кнопки, input-ы логина и пароля
 * @type {Element}
 */
const goLogin = document.querySelector('#goLogin')
const goRegister = document.querySelector('#goRegister')

const loginBlock = document.querySelector('.login')
const registerBlock = document.querySelector('.register')

/**
 * Анимации перехода между логин и регистрации
 */
goLogin.addEventListener('click', e => {
    e.preventDefault()
    loginBlock.classList.add('showForm')
    loginBlock.classList.remove('hideForm')
    registerBlock.classList.add('hideForm')
    registerBlock.classList.remove('showForm')
})

goRegister.addEventListener('click', e => {
    e.preventDefault()
    loginBlock.classList.remove('showForm')
    loginBlock.classList.add('hideForm')
    registerBlock.classList.add('showForm')
    registerBlock.classList.remove('hideForm')
})

/**
 * Отмена отправки данных из input-ов по-умолчанию
 */
for (let form of document.forms) {
    form.addEventListener('submit', e => {
        e.preventDefault()
    })
}