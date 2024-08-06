const zlib = require('zlib');

module.exports = (req, res, next) => {
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.includes('gzip')) {
        return next();
    }

    // Set the Content-Encoding header to gzip
    res.setHeader('Content-Encoding', 'gzip');

    // Create a gzip stream
    const gzip = zlib.createGzip();

    // Pipe the response through gzip
    const oldWrite = res.write;
    const oldEnd = res.end;

    // Override the write method
    res.write = function (chunk, encoding, callback) {
        if (!res.headersSent) {
            res.setHeader('Content-Encoding', 'gzip');
        }
        gzip.write(chunk, encoding, callback);
    };

    // Override the end method
    res.end = function (chunk, encoding, callback) {
        if (chunk) {
            gzip.write(chunk, encoding);
        }
        gzip.end();
        gzip.on('end', () => {
            res.end = oldEnd;
            res.end(chunk, encoding, callback);
        });
    };

    // Pipe the compressed stream to the response
    gzip.on('data', (compressedChunk) => {
        oldWrite.call(res, compressedChunk);
    });

    gzip.on('error', (err) => {
        console.error('Compression error:', err);
        res.end();  // Ensure response ends on error
    });

    next();
};
