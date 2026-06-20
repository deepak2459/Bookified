import mongoose from "mongoose";
import {promise} from "zod";


const mongodb = process.env.MONGODB_URI;
if(!mongodb) throw new Error("MONGODB_URI is not defined");

declare global{
    var cached :{
        conn : typeof mongoose | null
        promise : Promise<typeof mongoose> | null

    }
}

let cache   = global.cached ||( global.cached = {conn:null,promise:null});


export const connectdb  = async() =>{
    if(cache.conn) return cache.conn;

    if(!cache.promise){
        cache.promise = mongoose.connect(mongodb,{bufferCommands : false});

    }

    try{
        cache.conn = await cache.promise;



    }catch(error){
        cache.promise = null;
        throw error;

    }
    console.info("Connected to MongoDB");
    return cache.conn;
}