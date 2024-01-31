const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Animal = require('./animal.controller')
const port = 3000

require('dotenv').config();

// Accede a las variables de entorno
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const stringSecreto = process.env.JWT_STRING;

//conexion db
try {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.rihd75b.mongodb.net/animals?retryWrites=true&w=majority`)
    console.log('Conexión a la base de datos exitosa');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error)
}

app.use(express.json())

app.get('/animals', Animal.list)
app.post('/animals', Animal.create)
app.put('/animals/:id', Animal.update)
app.patch('/animals/:id', Animal.update)
app.delete('/animals/:id', Animal.destroy)

app.use(express.static('app'))

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`)
})
app.get('*', (req, res) => {
	res.status(404).send('Esta página no existe')
})

app.listen(port, () => {
	console.log('Arrancando el servidor')
})
