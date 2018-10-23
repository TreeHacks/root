const faviconsContext = require.context(
  '!!file-loader?name=favicon.png!.',
  true,
  /\.(svg|png|ico|xml|json)$/
);

faviconsContext.keys().forEach(faviconsContext);
