const express = require('express')
const path = require("path");
const app = express()
const PORT = 5000

app.use(express.json({extended: true}))
app.use('/api/emailSender', require('./routes/emailSender.routes'))

const start = async () => {
    try{
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    }catch (e){
        console.error('Server error:', e.message)
        process.exit(1)
    }
}

start()