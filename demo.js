var createGame = require('voxel-engine')
var texturePath = require('painterly-textures')(__dirname)
var MapChunker = require('./index')

var my_map = new MapChunker({
  tile_url: "http://tile.stamen.com/toner/{Z}/{X}/{Y}.png"
});
window.my_map = my_map;
var game = createGame({
  generateVoxelChunk: function(){
    return my_map.generateVoxelChunk.apply(my_map,arguments);
  },
  startingPosition: [185,100,0],
  texturePath: texturePath
});

window.game = game;
var container = document.querySelector('#container')
game.appendTo(container);

container.addEventListener('click', function() {
    game.requestPointerLock(container);
})

//hacky reload of image tiles.
setInterval(function() {
  for (key in game.voxels.chunks){
    var chunk = game.voxels.chunks[key];
    if (chunk.loaded && !chunk.shown) {
      game.showChunk(chunk);
      chunk.shown = true;
    }
  }
  game.voxels.generateMissingChunks(game.controls.yawObject.position);
}, 1000);
