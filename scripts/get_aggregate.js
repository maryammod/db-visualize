const shell = require("shelljs");
const consola = require("consola");
const path = require("path");
const cliProgress = require("cli-progress");
const fs = require("fs");
const dayjs = require("dayjs");
const ObjectsToCsv = require('objects-to-csv')
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017?writeConcern=majority";
const client = new MongoClient(uri);

//

const run = async () => {
  await client.connect();
  const db = client.db("maryam_thesis");
  const photos = db.collection("photos");

  let data =[]
  let q1_data = []
  
  let cursor = photos.aggregate([
    {
      $match: {
        taken_at: { $gte: new Date("2020-04-01T00:00:00Z") },
      },
    },
    {
      $group: {
        _id: { label: "$label_2" },
        label: { $first: "$label_2"},
        plant_ids: { $addToSet: "$plant_id_2" },
      },
    }
  ])
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    doc.plant_ids.forEach(async (thisPlant)=>{
      q1_data.push({
        label:doc.label, 
        plant_id: thisPlant
      })
    })
  };

  for (const d of q1_data){
    console.log(d.label, d.plant_id)
    let cursor2 = photos.aggregate([
      {
          $match:{ plant_id_2: d.plant_id}
      },
      {
        $group: {
          _id: null,
          plant_id_2: { $last: "$plant_id_2"},
          count: { $sum: 1 },
        },
      }
    ])

    while (await cursor2.hasNext()) {
      const doc2 = await cursor2.next();
      data.push( {label:d.label, plant_id: d.plant_id, count: doc2.count} )
    }
  }

  const csv = new ObjectsToCsv(data)
  await csv.toDisk('./agg.csv')
  
  // fs.writeFileSync("agg.json", JSON.stringify(data));
  process.exit();
};

run();
