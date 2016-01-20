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
  .option('-t, --title [name]', 'Poetry title')
  .parse(process.argv);

if (program.title) {
  title = program.title;
  titleSlug = slug(title, { lower: true });
} else {
  console.error('Missing title. Use --title flag.');
  return;
}

directoryPath = './public/poetry/' + titleSlug

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

    addPoetrySlugToListOfPoetry(titleSlug);

    console.log('✓ Added ' + titleSlug + ' to ./public/poetry/_data.json');
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
      layout: '../_poetry/_layout'
    }
  };

  return JSON.stringify(data, null, 2);
}

function copyIndexFile(toLocation) {
  var FILE_NAME = 'index.ejs';
  var SOURCE_FILE = './templates/poetry/' + FILE_NAME;
  fs.createReadStream(SOURCE_FILE).pipe(fs.createWriteStream(toLocation + '/' + FILE_NAME));
}

function addPoetrySlugToListOfPoetry(poetrySlug) {
  var listOfPoetry = JSON.parse(fs.readFileSync('./public/poetry/_data.json', 'utf8'));

  if (listOfPoetry.poetry.indexOf(poetrySlug) === -1) {
    listOfPoetry.poetry.push(poetrySlug);
  }

  fs.writeFileSync('./public/poetry/_data.json', JSON.stringify(listOfPoetry, null, 2), 'utf-8', {'flags': 'w+'});
}
