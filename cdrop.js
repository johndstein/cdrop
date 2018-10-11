var http = require('http');
var formidable = require('formidable');
var shortid = require('shortid');
var fs = require('fs');
var cache = {};
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
        cache[id] = files.file.path;
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(`<a href="http://${req.headers.host}/${id}">http://${req.headers.host}/${id}</a>\n${req.headers.host}/${id}\n`);
        res.end();
      }
    });
  } else if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write('<form action="/" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="file"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  } else {
    var id = req.url.substring(1);
    if (cache[id]) {
      var stat = fs.statSync(cache[id]);
      res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + id + '"',
        'Content-Length': stat.size
      });
      fs.createReadStream(cache[id])
        .pipe(res)
        .on('finish', () => {
          console.log('deleting', id, cache);
          fs.unlinkSync(cache[id]);
          delete cache[id];
        });
    } else {
      res.statusCode = 404;
      res.write('you are lost');
      res.end();
    }
  }
}).listen(process.env.PORT || 8080);