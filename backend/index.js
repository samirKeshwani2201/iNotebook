const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 
connectToMongo();
const app = express()
const port = 5000


app.use(cors())
// To use req.body  we have to attach the middle ware 
app.use(express.json());


// As to connect the mongo it takes time so at that time the code below it gets executed  so Example app lis.. runs first  

app.get('/', (req, res) => {
    res.send('Hello Wordjld!')
})

//  Available routes :                                          
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`iNotebook backend listening on port ${port}`)
})
