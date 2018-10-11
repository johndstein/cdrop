var http = require('http');
var formidable = require('formidable');
var shortid = require('shortid');
var fs = require('fs');
var cache = {};
var readme = (fs.readFileSync('./README.md') + '').trim();

http.createServer(function(req, res) {
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
        res.write(`<a href="//${req.headers.host}/${id}">${req.headers.host}/${id}</a>\n${req.headers.host}/${id}\n`);
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
    res.write('<pre>\n\n' + readme + '\n</pre>\n');
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