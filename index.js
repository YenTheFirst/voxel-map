var PNGReader = require('png.js');

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
  this.zoom = zoom;

  //calculate origin tile in tile coordinates.
  //TODO: actually implement.
  this.origin_tile = {
    //this is assuming zoom 20
    x: 167888,
    y: 405152
  };
}

MapChunker.prototype.generateVoxelChunk = function(cx, cy, cz, callback){
  //set up a default empty array
  var len = Math.pow(this.chunk_size,3);
  var voxels = new Int8Array(len);
  for (var i=0; i<voxels.length; i++) {voxels[i] = 0;}
  var the_chunk = {
    voxels: voxels,
    dims: [this.chunk_size, this.chunk_size, this.chunk_size],
    position: [cx, cy, cz]
  };

  if (cy < 0 || cy > 0) {
    //if we're not a ground-level tile, return a simple result.
    //for now, assume empty
    callback(the_chunk);
  }
  else {
    //get an image tile, and render it into our chunk
    var url = this.tile_url.replace("{X}", this.origin_tile.x + cx)
      .replace("{Y}", this.origin_tile.y + cz)
      .replace("{Z}", this.zoom);
    var chunk_size = this.chunk_size;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      if (this.status == 200) {
        var reader = new PNGReader(this.response);
        reader.parse(function(err, png) {
          console.log(png);
          for (var x=0;x<chunk_size;x++){
            for (var z=0; z<chunk_size;z++){
              var color = png.getPixel(x*8, z*8);
              if (color[0] > 128) {
                the_chunk.voxels[x+z*chunk_size*chunk_size]=1;
              }
            }
          }
          callback(the_chunk);
        });
      }
    };
    xhr.send();

  }
}
