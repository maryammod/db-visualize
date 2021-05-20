const photos = db.getCollection("photos");
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
const dataset = db.getCollection("dataset");

["G1", "G2", "G3"].forEach(async (group) => {
  const stream = photos.find({ group: { $eq: group } });
  while (await stream.hasNext()) {
    let doc = await stream.next();
    delete doc["_id"];
    dataset.insertOne(doc);
  }
});
