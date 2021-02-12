// create and initialize a 3D renderer
var r = new X.renderer3D();
r.init();

// create a X.volume
var volume = new X.volume();
// .. and attach the single-file dicom in .NII format
// this works with gzip/gz/raw encoded NII files but XTK also supports other
// formats like MGH/MGZ, NRRD and DICOM
volume.file = 'http://x.babymri.org/?avf.nii';

r.add(volume);

r.render();

