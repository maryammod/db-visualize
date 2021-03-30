print("plant_id,label,count");
db.getCollection('photos').aggregate( [
  {
    $match: {
      planted_at: { $gte: new Date("2020-02-01T00:00:00Z") },
      age: { $gte: 20 },
    },
  },
  {
    $group: {
       _id: { plant_id : "$plant_id" },
       plant_id: { $first: "$plant_id"},
       label: { $first: "$label"},
       count: { $sum: 1 }
    }
  }
],
{ allowDiskUse: true }
).forEach((item)=>{
  
  print(`${item.plant_id},${item.label},${item.count}`);
})


