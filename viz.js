window.onload = function() {
    // create and initialize a 3D renderer
    var r = new X.renderer3D();
    r.init();

    // create X.fibers
    var fibers = new X.fibers();

    // .. associate the TrackVis .TRK file
    fibers.file = '../data/pathlines-model-enh.trk';
    
    //fibers.linewidth = 50

    // create a X.volume
    var volume = new X.volume();
    
    // .. and attach the single-file dicom in .NRRD format
    // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
    // formats like MGH/MGZ
    //volume.file = 'http://x.babymri.org/?avf.nrrd';
    volume.file = '../data/1-T1c.nii';
    
    volume.visible = true;
    var volumeWasLoaded = false;

    // add fibers
    r.add(fibers);

    if (volume.visible) {
      r.add(volume);
      var volumeWasLoaded = true
    }
    
    // Some global variables to maintain state when animatid
    var animate = true;
    var trackSwipingThresholdControllerGlobal;
    var maxtGlobal;
    var frameCount = 1

    // the onShowtime method gets executed after all files were fully loaded and
    // just before the first rendering attempt
    r.onShowtime = function() {
      
      //
      // The GUI panel
      //
      // (we need to create this during onShowtime(..) since we do not know the
      // volume dimensions before the loading was completed)
      var gui = new dat.GUI();

      gui.width = window.innerWidth

      gui.autoPlace = false
      
      gui.domElement.id = 'gui';

      var resetview = {
        resetCamera: function() {
          r.resetViewAndRender()
        }
      }
      var resetController = gui.add(resetview, 'resetCamera');
      
      var animateobject = {
        animated: function() {
          animate = !animate
        }
      }
      var animateController = gui.add(animateobject, 'animated');
      
      var trackgui = gui.addFolder('Growth fibers');
      trackVisibleController = trackgui.add(fibers, 'visible');
      trackOpacityController = trackgui.add(fibers, 'opacity', 0, 1)
      trackOpacityController.setValue(0.5);
      var mint = fibers.scalars.min
      var maxt = fibers.scalars.max
      maxtGlobal = maxt
      trackMinScalarController = trackgui.add(fibers.scalars, 'lowerThreshold', mint, maxt)
      trackMaxScalarController = trackgui.add(fibers.scalars, 'upperThreshold', mint, maxt)    
      var trackSwipingThreshold = {swipingThreshold: 3}
      trackSwipingThresholdController = trackgui.add(trackSwipingThreshold, 'swipingThreshold', mint, maxt)
      trackSwipingThresholdControllerGlobal = trackSwipingThresholdController
      trackSwipingThresholdController.onChange(function (value) {  
        min_existing = trackMinScalarController.getValue()
        max_existing = trackMaxScalarController.getValue()
        mean = min_existing + (max_existing - min_existing)/2
        offset = value - mean
        trackMinScalarController.setValue(min_existing+offset*0.5)
        trackMaxScalarController.setValue(max_existing+offset*0.5)
      })
      var resettrackparams = {
        reset: function() {
          trackSwipingThresholdController.setValue(3)
          trackMinScalarController.setValue(mint)
          trackMaxScalarController.setValue(maxt)
          
        }
      }
      var resettrackparams = trackgui.add(resettrackparams, 'reset');
      trackgui.close();
      
      // the following configures the gui for interacting with the X.volume
      var volumegui = gui.addFolder('Tumor volume');
      var volumeVisibleController = volumegui.add(volume, 'visible');
      
      function popluate_volumegui() {
        // activate volume rendering
        //volume.volumeRendering = true;
        //volume.opacity = 0.05;
        //volume.opacity = 0.5;
        volume.windowLower = volume.min;
        volume.windowHigh = 120;
        volume.lowerThreshold = 10;
        volume.upperThreshold = volume.max;
        volume.indexX = 45;
        volume.indexY = 0;
        volume.indexZ = 0;
        
        var vrController = volumegui.add(volume, 'volumeRendering');
        
        var opacityController = volumegui.add(volume, 'opacity', 0, 1)
        opacityController.setValue(0.5)
        var lowerWindowController = volumegui.add(volume, 'windowLow', volume.min, volume.max);
        var upperWindowController = volumegui.add(volume, 'windowHigh', volume.min, volume.max);
        var lowerThresholdController = volumegui.add(volume, 'lowerThreshold', volume.min, volume.max);
        var upperThresholdController = volumegui.add(volume, 'upperThreshold', volume.min, volume.max);
        var sliceXController = volumegui.add(volume, 'indexX', 0, volume.dimensions[0] - 1);
        var sliceYController = volumegui.add(volume, 'indexY', 0, volume.dimensions[1] - 1);
        var sliceZController = volumegui.add(volume, 'indexZ', 0, volume.dimensions[2] - 1);
      }
      
      if (volumeWasLoaded) {
        popluate_volumegui();
        volumegui.close();
      }

      // the visible controller shows/hides the volume but also loads the file on
      // demand (only the first time)

      // volumegui callbacks
      volumeVisibleController.onChange(function(value) {
        if (!volumeWasLoaded) {
          
          // this only gets executed the first time to load the volume, after we
          // just toggle the visibility
          r.add(volume);
          
          r.onShowtime = function() {
            popluate_volumegui();
          }

          // set the loaded flag
          volumeWasLoaded = true;
        }
      })  
    }
    
    // adjust the camera position a little bit, just for visualization purposes
    r.camera.position = [0, 200, 0];
    
    // animate..
    r.onRender = function() {
      
      if (animate) {
        // rotate the skull around the Z axis
        // since we moved the camera, it is Z not X
        //fibers.transform.rotateY(0.05);
        r.camera.rotate([-1,0]);

        if (! (frameCount % 4)) {
          var v = trackSwipingThresholdControllerGlobal.getValue()+0.1;
          
          if (v > 0.9*maxtGlobal) {
            trackSwipingThresholdControllerGlobal.setValue(3);
          }
          else {
            trackSwipingThresholdControllerGlobal.setValue(v);
          }          
          frameCount = 1;
        }
        else {
          frameCount += 1;
        }

      }
    
    }
    
    // showtime! this triggers the loading of the volume and executes
    // r.onShowtime() once done
    r.render();
  };
  