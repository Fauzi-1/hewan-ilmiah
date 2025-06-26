const jwt = require('jsonwebtoken');

// Middleware untuk melindungi route yang hanya bisa diakses oleh admin yang terautentikasi
const protect = (req, res, next) => {
  let token;

  // Memastikan token dikirim melalui header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Mendapatkan token dari header Authorization
      token = req.headers.authorization.split(' ')[1];

      // Memverifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Menyimpan informasi user dari token ke request untuk digunakan di route berikutnya
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token tidak valid:', err);
      res.status(401).json({ message: 'Token tidak valid, harap login kembali' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, harap login terlebih dahulu' });
  }
};

module.exports = protect;
