import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.DB_CONNECTION_STRING) {
  throw new Error('Missing environment variable: "DB_CONNECTION_STRING"');
}

const uri = process.env.DB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    //strict: true,
    deprecationErrors: true,
  },
  monitorCommands:true,
  maxIdleTimeMS:10000
});

export default async function Connection(db, coll) {
    try{
      if(db){
        if(coll){
          return client.db(db).collection(coll)
        }
        return client.db(db)
      }
      return client
    }catch(error){
      throw new Error("Connection error. Please check your network and try again!")
    }
}