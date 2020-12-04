


//print out each of the names
db.test1.find().forEach(
  function(test1document){print(test1document.name)}
  )

db.test1.find().forEach(
    function(test1document){
      db.test2.find()
}
    )


    db.pets.aggregate([
      {
          $lookup:
          {
             from: "food",
             localField: "id",
             foreignField: "pet_id",
             as: "favorite_foods"
          }
      },
      { $out : "mergedFoods" }
      ]).pretty()

      //seems backwards....
      db.pets.aggregate([
        {
           $lookup: {
              from: "food",
              localField: "id",
              foreignField: "pet_id",
              as: "favorite_foods"
           }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$favorite_foods", 0 ] }, "$$ROOT" ] } }
        },
        { $project: { favorite_foods: 0 } },
        { $out : "mergedFoods" }
      ])
///asdfsdadsf
      db.pets.aggregate([
        {
           $lookup: {
              from: "food",
              localField: "id",
              foreignField: "pet_id",
              as: "favorite_foods"
           }
        },
        {$unwind:"$favorite_foods"},
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$favorite_foods", 0 ] }, "$$ROOT" ] } }
        },
        { $project: { favorite_foods: 0 } },
        { $out : "mergedFoods" }
      ])


//try 2
db.foods.aggregate([
  {
     $lookup: {
        from: "pets",
        localField: "pet_id",
        foreignField: "id",
        as: "favorite_foods"
     }
  },
  {    "$unwind": "$favorite_foods"
  },
  {
    $lookup: {
      from: "foods",
      localField: "favorite_foods.food",
      foreignField: "id",
      as: "favorite_foods.food"
   }
  },
  {
     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$favorite_foods", 0 ] }, "$$ROOT" ] } }
  },
  { $project: { favorite_foods: 0 } },
  { $out : "mergedFoods" }
])


{ $project: { favorite_foods: 0 } },
{ $out : "mergedFoods" }






      db.orders.aggregate([
        {
           $lookup: {
              from: "items",
              localField: "item",
              foreignField: "item",
              as: "fromItems"
           }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
        },
        { $project: { fromItems: 0 } },
        { $out : "newTest" }
      ])



      db.orders.aggregate([
        {
           $lookup: {
              from: "items",
              localField: "item",
              foreignField: "item",
              as: "fromItems"
           }
        },

      ])


