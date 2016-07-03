var buildify = require('buildify');
 

buildify()
  .load('src/impress.js')
  .concat(['src/plugins/autoplay/autoplay.js',
           'src/plugins/navigation/navigation.js',
           'src/plugins/navigation-ui/navigation-ui.js',
           'src/plugins/rel/rel.js',
           'src/plugins/extras/extras.js'])
  .save('js/impress.js');
  // Minification is temporarily broken, as buildify doesn't support for(var x of array)
  // https://github.com/powmedia/buildify/issues/17
  //.uglify()
  //.save('js/impress.min.js');
