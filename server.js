
const express = require('express')
const BP = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()


const dbAdress = "mongodb+srv://park:4275@cluster0.butqn.mongodb.net/Croo_1?retryWrites=true&w=majority"
const dbOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


mongoose
    .connect(dbAdress, dbOption)
    .then(() => console.log('MongoDB started'))
    .catch(err => console.log(err))


const userRoute = require('./routes/user')


app.use(morgan('dev'))
app.use(BP.json())
app.use(BP.urlencoded({ extended: false}))


app.use('./user', userRoute)



const port = 4321

app.listen(port, console.log('server started'))