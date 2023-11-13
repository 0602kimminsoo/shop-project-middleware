// express framework 를 불러온다.
const express = require('express')
// express 를 통해 웹 서버(웹 애플리케이션을 할당한다)
const app = express()
// 프로그램의 port : 3000번을 할당한다.
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// 프로그램이 3000번을 열고, 요청을 받기 위해 대기 한다.
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})