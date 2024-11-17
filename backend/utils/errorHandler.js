function errorHandler(err, req, res, next) {
    console.error('Error:', err.message || err);
    res.status(500).send(err.message || 'Internal Server Error');
}

module.exports = errorHandler