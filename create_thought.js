var program = require('commander');
var slug = require('slug');
var mkdirp = require('mkdirp');
var touch = require('touch');
var fs = require('fs');
var moment = require('moment');
var title;
var titleSlug;
var directoryPath;

program
  .option('-t, --title [name]', 'Thought title')
  .parse(process.argv);

if (program.title) {
  title = program.title;
  titleSlug = slug(title, { lower: true });
} else {
  console.error('Missing title. Use --title flag.');
  return;
}

directoryPath = './public/thoughts/' + titleSlug

mkdirp(directoryPath, function (error) {
  if (error) {
    console.log(error);
    return;
  }

  console.log('✓ Created ' + directoryPath);

  touch.sync(directoryPath + '/_content.md');

  console.log('✓ Created ' + directoryPath + '/_content.md');

  fs.writeFile(directoryPath + '/_data.json', createDataJson(), function (error) {
    if (error) {
      console.log(error);
      return;
    }

    console.log('✓ Created ' + directoryPath + '/_data.json');

    copyIndexFile(directoryPath);

    console.log('✓ Copied index.ejs');

    addThoughtSlugToListOfThoughts(titleSlug);

    console.log('✓ Added ' + titleSlug + ' to ./public/thoughts/_data.json');
  });

});

function createDataJson() {
  var date = moment().format('YYYY/MM/DD');
  moment.locale('ru');
  var dateString = moment().format('Do MMMM YYYY');

  var data = {
    index: {
      title: title,
      date: date,
      dateString: dateString,
      layout: '../_thought/_layout'
    }
  };

  return JSON.stringify(data, null, 2);
}

function copyIndexFile(toLocation) {
  var FILE_NAME = 'index.ejs';
  var SOURCE_FILE = './templates/thought/' + FILE_NAME;
  fs.createReadStream(SOURCE_FILE).pipe(fs.createWriteStream(toLocation + '/' + FILE_NAME));
}

function addThoughtSlugToListOfThoughts(thoughtSlug) {
  var listOfThouths = JSON.parse(fs.readFileSync('./public/thoughts/_data.json', 'utf8'));

  if (listOfThouths.thoughts.indexOf(thoughtSlug) === -1) {
    listOfThouths.thoughts.push(thoughtSlug);
  }

  fs.writeFileSync('./public/thoughts/_data.json', JSON.stringify(listOfThouths, null, 2), 'utf-8', {'flags': 'w+'});
}
