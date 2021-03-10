window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  r.camera.position = [0, 0, 150];
  
  // create a new X.fibers
  var fibers = new X.fibers();
  // .. associate the TrackVis .TRK file
  //fibers.file = '../data/pathlines-reduced-farneback-enh.trk';
  //fibers.file = '../data/pathlines-farneback-enh.trk';
  fibers.file = '../data/pathlines-reduced-farneback-all.trk';
  
  // .. add the fibers
  r.add(fibers);
  
  var v = new X.volume();
  v.file = '../data/1-tumor.nii';
  r.add(v);

  // showtime!
  r.render();
  /*
  r.onShowtime = function() {

    // activate volume rendering
    v.volumeRendering = true;
    v.lowerThreshold = 5;
    v.windowLower = 0;
    v.windowHigh = 120;
    //v.minColor = [0, 0.06666666666666667, 1];
    //v.maxColor = [0.5843137254901961, 1, 0];
    v.opacity = 0.2;

  };
  */
  // activate volume rendering
  //v.volumeRendering = true;
  v.lowerThreshold = 5;
  v.windowLower = 0;
  v.windowHigh = 120;
  //v.minColor = [0, 0.06666666666666667, 1];
  //v.maxColor = [0.5843137254901961, 1, 0];
  v.opacity = 0.2;


  //volume = v;
  //*/
};
