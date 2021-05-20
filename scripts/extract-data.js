const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017?writeConcern=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("-------");
    const db = client.db("maryam_thesis");
    const photos = db.collection("photos");
    photos.createIndex(
      {
        group: 1,
      },
      {
        unique: false,
        sparse: true,
        expireAfterSeconds: 3600,
      }
    );

    db.createCollection("dataset");
    const dataset = db.collection("dataset");

    ["G1", "G2", "G3"].forEach(async (group) => {
      const stream = photos.find({ group: { $eq: group } });
      while (await stream.hasNext()) {
        let doc = await stream.next();
        delete doc["_id"];
        dataset.insertOne(doc);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
