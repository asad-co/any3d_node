const express = require('express')
const cors=require("cors");
const encryptResponse=require('./middleware/encrypt');


const app = express()
const port = 8000

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use('/api/loadmodel', require('./routes/loadmodel'))

//middleware
// app.use(encryptResponse)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})