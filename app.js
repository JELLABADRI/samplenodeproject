const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
}))

let {open} = require('sqlite')
let sqlite3 = require('sqlite3')
const format = require('date-fns/format')
const ismatch = require('date-fns/isMatch')
const isvalid = require('date-fns/isValid')
const path = require('path')
app.use(express.json())
const dbpath = path.join(__dirname, 'data.db')
let db = null
const intiallizedb = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(5000)
  } catch (e) {
    console.log(`Error: ${e.message}`)
    process.exit(1)
  }
}
intiallizedb()
app.post("/login",async (request,response) => {
  const {name,password}=request.body
  const q1=`select * from user where name="${name}";`
  const r1=await db.get(q1)
  console.log(r1)
  if(r1===undefined){
    console.log("not exists user")
    response.status(400)
    response.send("not exists user")
  }
  else{
    const match=r1.password===password
    if(match){
      console.log("logged in")
      response.send("logged in")
    }
    else{
      console.log("invalid password")
      response.status(400)
      response.send("invalid")
    }
  }

})
app.post("/register", async (request,response) => {
  const {name,password}=request.body
  const q1=`select * from user where name="${name}";`
  const r1=await db.get(q1)
  if(r1===undefined){
    const q2=`insert into user (name,password) values ("${name}","${password}");`
    const r2=await db.run(q2)
    console.log("created user")
    response.send("created user")
  }
  else{
    console.log("already user exists")
    response.send("already user exists")
  }
})

app.get("/", async (req,res) => {
    let r= `select * from todo;`
    let rr=await db.all(r)
    res.send(rr)
})

module.exports=app