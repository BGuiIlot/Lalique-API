const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');


const app = express();

app.use(cors());
app.use(bodyparser.json());


// Connexion a la base de donnee

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'logger',
    port:'3306'

});

// Vérification de la connection a la base donnee

db.connect(err=>{
    if (err) {console.log(err,'dberr');}
    console.log('database connected ...');
})

// get all data

app.get('/device',(req,res)=>{
    let qr = 'select * from balise'

    db.query(qr,(err,result)=>{

        if(err)
        {
            console.log(err,'errs');
        }

        if(result.length>0)
        {
            res.send({
                message:'all device data',
                data:result
            });
        }
    });
});

// Moyenne des temperatures par date(type 1 : temperature)
app.get('/device/1date',(req,res)=>{

    let request = `SELECT date, AVG(temperature) AS AVG_temp FROM balise WHERE type = 1 GROUP BY date `;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        if(result.length>0)
        {
            res.send({
                message:'get moyenne(temp) by date',
                data:result
            });
        }
        else
        {
            res.send({
                message:'data not found (avg temp)'
            });
        }
    });
});


// Moyenne des temperatures par date(type 3 : hygrometrie)
app.get('/device/3date',(req,res)=>{

    let request = `SELECT date, AVG(temperature) AS AVG_temp FROM balise WHERE type = 3 GROUP BY date `;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        if(result.length>0)
        {
            res.send({
                message:'get moyenne by date(hygro)',
                data:result
            });
        }
        else
        {
            res.send({
                message:'data not found (avg hygro)'
            });
        }
    });
});

app.get('/device/number',(req,res)=>{

    let request = `SELECT DISTINCT device FROM balise`;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        if(result.length>0)
        {
            res.send({
                message:'get device',
                data:result
            });
        }
        else
        {
            res.send({
                message:'data not found (device)'
            });
        }
    });
});



// get by types qr=request on video
app.get('/device/type-:type',(req,res)=>{

    let gType = req.params.type;

    let request = `select * from balise where type = ${gType}`;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        if(result.length>0)
        {
            res.send({
                message:'get by type',
                data:result
            });
        }
        else
        {
            res.send({
                message:'data not found (type)'
            });
        }
    });
});


// get single data qr=request on video type 1 
app.get('/device/1:device',(req,res)=>{

    let gDevice = req.params.device;

    let request = `SELECT date,device, AVG(temperature) AS AVG_temp FROM balise WHERE type = 1 and device = ${gDevice} GROUP BY date,device`;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        if(result.length>0)
        {
            res.send({
                message:'get single data (device type 1)',
                data:result
            });
        }
        else
        {
            res.send({
                message:'data not found (type 1)'
            });
        }
    });
});

// get single data qr=request on video type 3
app.get('/device/3:device',(req,res)=>{

    let gDevice = req.params.device;

    let request = `SELECT date,device, AVG(temperature) AS AVG_temp FROM balise WHERE type = 3 and device = ${gDevice} GROUP BY date,device`;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        if(result.length>0)
        {
            res.send({
                message:'get single data (device type 3)',
                data:result
            });
        }
        else
        {
            res.send({
                message:'data not found (type 3)'
            });
        }
    });
});


// create data 

app.post('/device',(req,res)=>{

    console.log(req.body,'createdata');

    let date = req.body.date;
    let time = req.body.time;
    let device = req.body.device;
    let temperature = req.body.temperature;
    let type = req.body.type;

    let request = `insert into balise(date,time,device,temperature,type)
    values('${date}','${time}','${device}','${temperature}','${type}')`;

    console.log(request,'request')
    db.query(request,(err,result)=>{

        if(err){console.log(err);}
        console.log(result,'result')
        res.send({
            message:'data inserted',
        });

    });

})

// update data

app.put('/device',(req,res)=>{

    console.log(req.body,'updatedata');

    let date = req.body.date;
    let time = req.body.time;
    let device = req.body.device;
    let temperature = req.body.temperature;
    let type = req.body.type;

    let request = `update balise set date = '${date}', device = '${device}', temperature = '${temperature}', type = '${type}' where time = '${time}'`;

    db.query(request,(err,result)=>{

        if(err) {console.log(err);}

        res.send({
            message:'data updated'
        });
    });

})

// delete single data 

app.delete('/device/:time/:date',(req,res)=>{
    let qTime = req.params.time;
    let qDate = req.params.date;

    let request = `delete from balise where time = '${qTime}' and date = '${qDate}'`;
    db.query(request,(err,result)=>{
        if(err) {console.log(err);}

        res.send(
            {
                message:'data deleted'
            }
        )
    });
});



app.listen(3000,()=>{
    console.log('server running...');
});