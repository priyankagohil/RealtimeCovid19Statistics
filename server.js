

const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(__dirname + 'dist/realtime-covid-cases'));
app.get('/*', function(req,res){
res.sendFile(path.join(__dirname, 'dist/realtime-covid-cases/index.html'))
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);