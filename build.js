var buildify = require('buildify');
 

buildify()
  .load('src/impress.js')
  .concat(['src/plugins/autoplay/autoplay.js',
           'src/plugins/extras/extras.js',
//           'src/plugins/goto/goto.js',
           'src/plugins/navigation/navigation.js',
           'src/plugins/navigation-ui/navigation-ui.js',
           'src/plugins/progress/progress.js',
           'src/plugins/rel/rel.js',
           'src/plugins/toolbar/toolbar.js'])
  .save('js/impress.js')
  .uglify()
  .save('js/impress.min.js');
