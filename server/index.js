const express =  require('express');
const app = express();
const cors = require('cors');
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: '*'
}));
//routes
app.use(require('./routes/index'));

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.listen(process.env.PORT||4000);

console.log('Server on port 4000');

