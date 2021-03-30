// db.getCollection('photos').aggregate( [
//   {
//       $match:{
//         plant_id_2:{ $exists: false}
//       }
//   },
//   {
//     $group: {
//        _id: { label : "$label" },
//        label: { $first: "$label"},
//        plant_id: { $first: "$plant_id"},
//        plant_id_2:{ $first: "$plant_id_2"},
//        count: { $sum: 1 }
//     }
//   }
// ] )

print("label,plant_id,count");
db.getCollection('photos').aggregate([
{
  $group: {
    _id: { label: "$label_2" },
    label: { $first: "$label_2"},
    plant_ids: { $addToSet: "$plant_id_2" },
  },
}
]).forEach((item)=>{


  item.plant_ids.forEach(thisPlant=>{
    print(item.label, thisPlant)
    db.getCollection('photos').aggregate([
      {
          $match:{ plant_id: thisPlant}
      },
      {
        $group: {
          _id: null,
          plant_id: { $last: "$plant_id"},
          count: { $sum: 1 },
        },
      }
    ]).forEach(res=>{
      print(`${item.label},${thisPlant},${res.count}`);
    })
  })
})