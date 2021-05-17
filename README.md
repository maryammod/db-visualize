## How to update

1. run

```
cd scripts
node sample.js
```

2. update Algolia with the new json
3. update cloudinary with 

```
cd scripts/samples
export CLOUDINARY_URL=cloudinary://581252376375535:DTevXg5TFYj_7Hu_OowtkE6IfJM@maryamone
cld upload_dir .
```


### run mongo queries

```
mongo --quiet maryam_thesis update_plant_id.js
```