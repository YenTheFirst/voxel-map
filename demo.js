var createGame = require('voxel-engine')
var texturePath = require('painterly-textures')(__dirname)
var MapChunker = require('./index')

var my_map = new MapChunker({
  tile_url: "http://tile.stamen.com/toner/{Z}/{X}/{Y}.png"
});
window.my_map = my_map;
var game = createGame({
  startingPosition: [185,100,0],
  texturePath: texturePath,
  generateChunks: false //we'll set a manual provider
});

game.voxels.on('missingChunk', function(chunkPos) {
  //this replaces both parts of voxel-engine and voxel
  //specifically, voxel.generateChunk.
  my_map.generateVoxelChunk(chunkPos[0], chunkPos[1], chunkPos[2], function(chunk) {
    game.voxels.chunks[chunkPos.join('|')] = chunk;
    game.showChunk(chunk);
  });
});

window.game = game;
var container = document.querySelector('#container')
game.appendTo(container);

container.addEventListener('click', function() {
    game.requestPointerLock(container);
})

