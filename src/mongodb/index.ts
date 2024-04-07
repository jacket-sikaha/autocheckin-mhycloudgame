import { MongoClient, ServerApiVersion } from "mongodb";
const uri = (username?: string, password?: string) =>
  username && password
    ? `mongodb+srv://${username}:${password}@cluster0.64eeq4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    : undefined;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const url = uri(process.env.MONGODB_USER, process.env.MONGODB_PASSWD);
const client = url
  ? new MongoClient(url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  : undefined;

export const insertLog = async (log: any) => {
  if (!client) {
    console.warn("no MongoClient");
    return;
  }
  try {
    await client.connect();
    return await client.db("genshin").collection("log").insertOne(log);
  } catch (err) {
    return err;
  } finally {
    await client.close();
  }
};

export const insertErrorLog = async (log: any) => {
  if (!client) {
    console.warn("no MongoClient");
    return;
  }
  try {
    await client.connect();
    return await client.db("genshin").collection("error").insertOne(log);
  } catch (err) {
    return err;
  } finally {
    await client.close();
  }
};
