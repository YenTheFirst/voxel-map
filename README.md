a basic module-type thing to render a webmap as voxel chunks

because of callbacks and javascript things I don't understand, it doesn't work 100% right now.

first off, png-js doesn't like being included this way for some reason. manually editing its zlib.js so that FlateStream is a global variable seems to work.

also, because voxels are actually set in a callback, the chunks need to be manually redrawn. Also, I think right now the voxel-engine doesn't automatically load new chunks as the player moves. so, there's the weird async-y thing in the demo.js
