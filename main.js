const express = require('express');
const app = express();
const eventRoutes = require('./routes/event.route');

app.use(express.json())
app.use('/events', eventRoutes)

app.get('/', (req, res) => {
    res.send('Hello World! Initialization');
});


app.listen(8000,()=>{
    console.log("App is Running On http://localhost:8000")
})
