import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

if (!process.env.DB_CONNECTION_STRING) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.DB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  monitorCommands:true
});

async function Connection(db, coll) {
  var connection = null
  try {
    connection = await client.connect();
    if(db){
      connection = connection.db(db)
      if(coll){
        connection = connection.collection(coll)
        return connection
      }
      return connection
    }

    if(!connection.s) {
      throw new Error()
    }

    return connection
  } catch(error){
    return NextResponse.json({error: "Error connecting to database. Please check your network and try again"},{status: 500, ok: false})
  }
}

export default Connection