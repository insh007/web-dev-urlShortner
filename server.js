const express = require('express')
const mongoose = require('mongoose')
const shortModel = require('./models/urlModel')
const app = express()

mongoose.connect("mongodb+srv://insh007:Inshad123@firstcluster.p0r04o1.mongodb.net/WDS-urlShortner",{
    useNewUrlParser:true
}, mongoose.set('strictQuery', false))
.then(()=>console.log("MongoDB is connected"))
.catch((err)=>console.log(err))

app.set('view engine', 'ejs') //setup ejs (Embedded Javascript Template)
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req,res)=>{
    const shortUrls = await shortModel.find()
    res.render('index', {shortUrls:shortUrls})
})

app.post('/shortUrls', async (req, res)=>{
    await shortModel.create({full : req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res)=>{
    const shortUrl = await shortModel.findOne({short : req.params.shortUrl})
    if(shortUrl==null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(4000, ()=>console.log("Express app is running on port",4000))