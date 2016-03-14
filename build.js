var buildify = require('buildify');
 
 // TODO: When there are more plugins in src/plugins/*, the idea is to add all of them automatically, rather than explicitly listing them below.
 
buildify()
  .load('src/impress.js')
  .concat(['src/plugins/navigation/navigation.js', 'src/plugins/autoplay/autoplay.js'])
  .save('js/impress.js')
  .uglify()
  .save('js/impress.min.js');
