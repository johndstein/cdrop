var http = require('http');
var formidable = require('formidable');
var shortid = require('shortid');
var fs = require('fs');
var cache = {};
var readme = (fs.readFileSync('./README.md') + '').trim();
var readme2;

http.createServer(function(req, res) {
  if (!readme2) {
    readme2 = readme.replace(/localhost:8080/g, req.headers.host);
  }
  if (req.method === 'POST') {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
        res.statusCode = 500;
        res.write('ooops');
        res.end();
      } else {
        var id = shortid.generate();
        cache[id] = {
          size: files.f.size,
          path: files.f.path,
          name: files.f.name,
          type: files.f.type
        };
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(`<a href="//${req.headers.host}/${id}">${req.headers.host}/${id}</a>\ncurl ${req.headers.host}/${id} > somefile.txt\n`);
        res.end();
      }
    });
  } else if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write('<form action="/" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="f">');
    res.write('<input type="submit">');
    res.write('</form>');
    res.write('<pre>\n\n' + readme2 + '\n</pre>\n');
    res.end();
  } else {
    var id = req.url.substring(1);
    var file = cache[id];
    if (file) {
      res.writeHead(200, {
        'Content-Type': file.type,
        'Content-Disposition': 'attachment; filename="' + file.name + '"',
        'Content-Length': file.size
      });
      fs.createReadStream(file.path)
        .pipe(res)
        .on('finish', () => {
          fs.unlinkSync(file.path);
          delete cache[id];
        });
    } else {
      res.statusCode = 404;
      res.write('you\'re lost');
      res.end();
    }
  }
}).listen(process.env.PORT || 8080);