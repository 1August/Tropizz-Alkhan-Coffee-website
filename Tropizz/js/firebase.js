/**
 * Импорт firebase и вспомогательных библиотек
 */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js'
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'
import {
    child,
    getDatabase,
    push,
    ref,
    set,
    update
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref as refStorage,
    uploadBytesResumable
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"

/**
 * Конфигурация firebase
 * @type {{storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, databaseURL: string, authDomain: string}}
 */
const firebaseConfig = {
    apiKey: "AIzaSyD6kXmjGovzh0ce9Q_lPQJbLB8vkyDPs04",
    authDomain: "alkhan-ebe22.firebaseapp.com",
    databaseURL: "https://alkhan-ebe22-default-rtdb.firebaseio.com",
    projectId: "alkhan-ebe22",
    storageBucket: "alkhan-ebe22.appspot.com",
    messagingSenderId: "767424477169",
    appId: "1:767424477169:web:246df69114798df9737650"
}

/**
 * Нужные переменные для работы с кодом
 */
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const googleProvider = new GoogleAuthProvider()
const database = getDatabase(app)
const storage = getStorage(app)

/**
 * Кнопки регистрации, логина и выхода
 * @type {Element}
 */
const registerBtn = document.querySelector('#registerBtn')
const loginBtn = document.querySelector('#loginBtn')
const loginWithGoogleBtn = document.querySelector('#loginWithGoogleBtn')
const signOutBtns = document.querySelectorAll('.signOut')

/**
 * Аватарка пользователя и имя
 * @type {Element}
 */
const userAvatar = document.querySelector('#userAvatar')
const uploadInput = document.querySelector('#uploadImg')
const userName = document.querySelector('#userName')
let uploadProgress = 0

/**
 * Кнопка "Заказать"
 * @type {Element}
 */
const orderProductsBtn = document.querySelector('.orderProducts')

/**
 * Загрузка аватарки с базы данных
 */
if (userAvatar) {
    const refImgStorage = refStorage(storage, `${JSON.parse(sessionStorage.getItem('user')).userId}/img/userAvatar`)
    getDownloadURL(refImgStorage).then(url => userAvatar.src = url)
}

/**
 * Для показа ошибки при регистрации или логина
 * @param err
 */
const showErrMsg = err => {
    const errEls = document.querySelectorAll('.errorMsg')
    errEls.forEach(el => {
        el.innerHTML = err.message
        setTimeout(() => {
            el.innerHTML = ''
        }, 3000)
    })
}

/**
 * Регистрация и сохранение в базе данных
 */
registerBtn?.addEventListener('click', e => {
    registerBtn.disabled = true

    const email = document.querySelector('#register_email').value
    const password = document.querySelector('#register_password').value

    // Использование firebase для регистрации через email, password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user

            set(ref(database, `users/${user.uid}`), {email, password})
                .then(() => {
                    signInWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            const user = userCredential.user
                            const log_date = new Date()

                            update(ref(database, `users/${user.uid}`), {last_login: log_date})
                                .then(() => {
                                    sessionStorage.setItem('user', JSON.stringify({
                                        userId: user.uid,
                                        email
                                    }))
                                    registerBtn.disabled = false
                                    window.history.go(-1)
                                })
                                .catch(e => {
                                    showErrMsg(e)
                                    registerBtn.disabled = false
                                })
                        })
                        .catch(e => {
                            showErrMsg(e)
                            registerBtn.disabled = false
                        })
                })
                .catch(e => {
                    showErrMsg(e)
                    registerBtn.disabled = false
                })
        })
        .catch(e => {
            showErrMsg(e)
            registerBtn.disabled = false
        })
})

/**
 * Логин через firebase
 */
loginBtn?.addEventListener('click', e => {
    loginBtn.disabled = true

    const email = document.querySelector('#login_email').value
    const password = document.querySelector('#login_password').value

    // Использование firebase для входа через email, password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            const log_date = new Date()

            update(ref(database, `users/${user.uid}`), {last_login: log_date})
                .then(() => {
                    sessionStorage.setItem('user', JSON.stringify({
                        userId: user.uid,
                        email: email
                    }))
                    loginBtn.disabled = false
                    window.history.go(-1)
                })
                .catch(e => {
                    showErrMsg(e)
                    loginBtn.disabled = false
                })
        })
        .catch(e => {
            showErrMsg(e)
            loginBtn.disabled = false
        })
})

/**
 * Логин через Google account
 */
loginWithGoogleBtn?.addEventListener('click', e => {
    loginWithGoogleBtn.disabled = true

    // Использование firebase для входа через Google
    signInWithPopup(auth, googleProvider)
        .then((userCredential) => {
            const user = userCredential.user
            const log_date = new Date()

            update(ref(database, `users/${user.uid}`), {last_login: log_date})
                .then(() => {
                    sessionStorage.setItem('user', JSON.stringify({
                        userId: user.uid,
                        email: user.email
                    }))
                    loginWithGoogleBtn.disabled = false
                    window.history.go(-1)
                })
                .catch(e => {
                    showErrMsg(e)
                    loginWithGoogleBtn.disabled = false
                })
        })
        .catch(e => {
            showErrMsg(e)
            loginWithGoogleBtn.disabled = false
        })
})

/**
 * Выход из аккаунта и перенаправление на главную страницу
 */
signOutBtns?.forEach(btn => {
    btn.addEventListener('click', e => {
        auth.signOut(auth).then(() => {
            sessionStorage.removeItem('user')

            const slashIndex = window.location.href.lastIndexOf('/')
            const extensionIndex = window.location.href.indexOf('.html')
            if (window.location.href.slice(slashIndex, extensionIndex) === '/user') {
                window.location.href = '/Tropizz/index.html'
                return
            }
            window.location.reload()
        })
            .catch(e => {
                console.error(e)
            })
    })
})

/**
 * Загрузка картинки при нажатии на кнопку смены аватарки пользователя
 */
uploadInput?.addEventListener('change', e => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    uploadImg(user.userId, e.target.files[0])
})

/**
 * Загрузка аватарки в базу данных через firebase
 * @param userId ID Пользователя
 * @param img Картинка для загрузки
 */
const uploadImg = (userId, img) => {
    if (!userId || !img) return

    const deleteRef = refStorage(storage, `${userId / img}`)
    if (deleteRef && Number.isNaN(deleteRef)) {
        deleteObject(deleteRef).then(() => {
            console.log('Deleted')
        }).catch(err => console.error(err))
    }
    const storageRef = refStorage(storage, `${userId}/img/userAvatar`)
    const uploadTask = uploadBytesResumable(storageRef, img)

    uploadTask.on('state_changed', snapshot => {
            const progress = Math.round(snapshot.bytesTransfered / snapshot.totalBytes) * 100
            uploadProgress = progress
        },
        err => console.log(err),
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then(url => userAvatar.src = url)
        })
}

/**
 * Изменение имени и сохранение в базе данных при изменении input на странице пользователя
 */
userName?.addEventListener('change', e => {
    const user = auth.currentUser
    updateProfile(user, {displayName: e.target.value})
        .catch(e => console.error(e))
})

/**
 * Загрузка имени пользователя из базы данных
 */
onAuthStateChanged(auth, (user) => {
    if (user && userName) userName.value = user.displayName
})

/**
 * Загрузка списка заказов в базу данных при нажатии на кнопку
 */
orderProductsBtn?.addEventListener('click', async e => {
    orderProductsBtn.disabled = true

    const user = auth.currentUser
    const date = new Date().toUTCString()
    const firstOrderTime = sessionStorage.getItem('firstOrderTime')
    const orders = JSON.parse(sessionStorage.getItem('cart'))
    if (!orders) {
        orderProductsBtn.disabled = false
        return
    }

    const timeToGive = sessionStorage.getItem('firstOrderTime')
    const dateNow = new Date()

    const year = dateNow.getFullYear()
    const month = `${dateNow.getMonth()}`.length === 1 ?`0${dateNow.getMonth()}` : `${dateNow.getMonth()}`
    const day = `${dateNow.getDay()}`.length === 1 ? `0${dateNow.getDay()}` : `${dateNow.getDay()}`
    const fullDateToGive = `${year}-${month}-${day} ${timeToGive}:00`

    const message = {
        email: user.email,
        subject: 'Заказ обработан! ',
        date: fullDateToGive,
        text: 'Спасибо за ваш заказ в Alkhan coffee bar! Вы получите их через 15 минут. Вы заказали: '
            + Object.entries(orders).reduce(
                (acc, entry) => { return `${acc}${entry[0]}: ${entry[1]}; `}, '') + `Заказ будет готов в ${timeToGive}.`
    }

    const url = 'http://localhost:5000/api/emailSender/sendEmail'
    await fetch(url, {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message),
        method: 'POST'
    }).then(res => res.json()).then(data => console.log('Success', data))

    const newOrderKey = push(child(ref(database), `users/${user.uid}/orders`)).key
    const updates = {}
    updates[`/users/${user.uid}/orders/${date}-${firstOrderTime}/${newOrderKey}`] = {...orders}

    orderProductsBtn.disabled = false
    sessionStorage.removeItem('cart')
    sessionStorage.removeItem('firstOrderTime')
    update(ref(database), updates)
        .then(() => {
            window.location.reload()
        })
        .catch(e => console.log(e))
})

