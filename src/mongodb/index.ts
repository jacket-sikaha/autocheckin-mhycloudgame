import { MongoClient, ServerApiVersion } from "mongodb";
const uri = (username: string, password: string) =>
  `mongodb+srv://${username}:${password}@cluster0.64eeq4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(
  uri(process.env.MONGODB_USER!, process.env.MONGODB_PASSWD!),
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

export const insertLog = async (log: any) => {
  try {
    await client.connect();
    return await client.db("genshin").collection("log").insertOne(log);
  } catch (err) {
    return err;
  } finally {
    await client.close();
  }
};

export const testinsertLog = async (log: any) => {
  try {
    await client.connect();
    return await client.db("genshin").collection("error").insertOne(log);
  } catch (err) {
    return err;
  } finally {
    await client.close();
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);
