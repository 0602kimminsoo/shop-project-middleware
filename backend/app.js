const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/todo-items', (req, res) => {
    const items = require("./dummy/todo-items.json")
    res.json(items)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})