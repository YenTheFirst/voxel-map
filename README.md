a basic module-type thing to render a webmap as voxel chunks

setting up the game:

this module renders chunks asynchronously, as it has to pull down tile information before it can render it.

In order to set this up, you need to create a listener on 'missingChunk' event, which accepts a callback with that takes a chunk, and have the callback show the chunk.


in order for png.js to browservefy correctly, you need to use the --ignore zlib option
