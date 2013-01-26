module.exports = MapChunker
function MapChunker(opts) {
  this.origin = opts.origin;
  this.meters_per_voxel = opts.meters_per_voxel || 1.0;
  this.tile_url = opts.tile_url;
  this.color_to_material = opts.color_to_material;
  this.materials = opts.materials || {
    "dirt": 1
  }
  //default chunk size. can we request this from the voxel engine directly?
  this.chunk_size = opts.chunk_size || 32;

  //get closest zoom level based on meters_per_voxel
  //1st, calculate how large a zoom 0 tile is, in voxels
  //km * m/km * voxels/m
  var voxel_len = 40075 * 1000 / this.meters_per_voxel;
  //2nd, get the zoom level that's closest to that many voxels per tile. (each zoom level has half voxels per tile)
  var ratio = voxel_len / this.chunk_size;
  var zoom = Math.round( Math.log(ratio) / Math.log(2) );

  //calculate origin tile in tile coordinates.
  //TODO: actually implement.
  this.origin_tile = {
    //this is assuming zoom 20
    x: 167888,
    y: 405152
  };
}

MapChunker.prototype.generateVoxelChunk = function(low_bounds, high_bounds, cx,cy,cz){
  //set up a default empty array
  var len = Math.pow(this.chunk_size,3);
  var voxels = new Int8Array(len);
  for (var i=0; i<voxels.length; i++) {voxels[i] = 0;}
  if (cy < 0 || cy > 0) {
    //if we're not a ground-level tile, return a simple result.
    //for now, assume empty
  }
  else {
    //get an image tile, and render it into our chunk
    //actually for now, just put a 1 in all x,y=0,z
    for (var x=0;x<this.chunk_size;x++){
      for (var z=0; z<this.chunk_size;z++){
        voxels[x+z*this.chunk_size*this.chunk_size]=1;
      }
    }
  }
  return {
    voxels:voxels,
    dims:[this.chunk_size, this.chunk_size, this.chunk_size]
  };
}
