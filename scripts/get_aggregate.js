const shell = require("shelljs");
const consola = require("consola");
const path = require("path");
const cliProgress = require("cli-progress");
const fs = require("fs");
const dayjs = require("dayjs");

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
      $group: {
        _id: { label: "$label" },
        label: { $first: "$label"},
        plant_ids: { $addToSet: "$plant_id" },
      },
    }
  ])
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    doc.plant_ids.forEach(async (thisPlant)=>{
      q1_data.push({label:doc.label, plant_id: thisPlant})
    })
  };

  for (const d of q1_data){
    console.log(d.label, d.plant_id)
    let cursor2 = photos.aggregate([
      {
          $match:{ plant_id: d.plant_id}
      },
      {
        $group: {
          _id: null,
          plant_id: { $last: "$plant_id"},
          count: { $sum: 1 },
        },
      }
    ])

    while (await cursor2.hasNext()) {
      const doc2 = await cursor2.next();
      data.push( {label:d.label, plant_id: d.plant_id, count: doc2.count} )
    }

  }


  console.log(data)
  
  fs.writeFileSync("agg.json", JSON.stringify(data));
  process.exit();
};

run();
