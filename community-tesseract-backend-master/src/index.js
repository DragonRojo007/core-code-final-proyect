const Express =require("express");
const CorsMiddleware =require("cors");
const {initializeDB} = require("./lib/db/");
const RequestHandler = require("./lib/handlers/handlers");

const Api = Express();



Api.use(Express.json());
Api.use(Express.urlencoded({extended: false}));
Api.use(CorsMiddleware());
Api.use("/api/v1", RequestHandler);
Api.listen(3000,() =>{
    console.log("API IS RUNNING");

    initializeDB().then(()=>{
        console.log("Start Database");

});

});

