db.getCollection('photos').find({ 
        // label: {$eq: "P007A90R"},
        // plant_id: { $regex: /^dlpea*/ } 
        label: { $eq: "Brandon"}
    }).forEach( function (elem) {
        print(`${elem.label} | ${elem.plant_id} -> ${elem.plant_id_2}`)
        db.getCollection('photos').update(
            {
                _id: elem._id
            },
            {
                $set: {
                    // plant_id_2: "dlpea",
                    label_2: "Wheat"
                }
            }
        );
    }
);

    // p002_011
    // p196_012


// db.getCollection('photos').find().forEach( function (elem) {
//         print(`${elem.label} | ${elem.plant_id} -> ${elem.plant_id_2}`)
//         db.getCollection('photos').update(
//             {
//                 _id: elem._id
//             },
//             {
//                 $set: {
//                     label_2: elem.label
//                 }
//             }
//         );
//     }
// );

