var buildify = require('buildify');
 

buildify()
  .load('src/impress.js')
  .concat(['src/lib/gc.js'])
  .concat(['src/plugins/autoplay/autoplay.js',
           'src/plugins/blackout/blackout.js',
           'src/plugins/extras/extras.js',
           'src/plugins/form/form.js',
           'src/plugins/goto/goto.js',
           'src/plugins/help/help.js',
           'src/plugins/mobile/mobile.js',
           'src/plugins/mouse-timeout/mouse-timeout.js',
           'src/plugins/navigation/navigation.js',
           'src/plugins/navigation-ui/navigation-ui.js',
           'src/plugins/progress/progress.js',
           'src/plugins/rel/rel.js',
           'src/plugins/resize/resize.js',
           'src/plugins/skip/skip.js',
           'src/plugins/stop/stop.js',
           'src/plugins/touch/touch.js',
           'src/plugins/toolbar/toolbar.js'])
  .save('js/impress.js')
  .uglify()
  .save('js/impress.min.js');
