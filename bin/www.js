const app = require('../index');
const dotenv = require('dotenv');

let envpath;

switch(process.env.NODE_ENV){
    case "prod":
        envpath = `${__dirname}/../env.prod`;
        break;
    case "dev":
        envpath = `${__dirname}/../env.dev`;
        break;
    default:
        envpath = `${__dirname}/../env.dev`;
}

dotenv.config({path:envpath});
// console.log('port : ' + process.env.PORT);

app.listen(process.env.PORT, ()=>{
    console.log('Server is running on '+ `${process.env.PORT}` + ' port');
});
