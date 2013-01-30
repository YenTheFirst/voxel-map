a basic module-type thing to render a webmap as voxel chunks

png-js doesn't like being included this way for some reason. manually editing its zlib.js so that FlateStream is a global variable seems to work.

