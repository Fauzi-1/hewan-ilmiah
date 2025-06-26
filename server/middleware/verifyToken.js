const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Periksa apakah ada header Authorization dan formatnya benar
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak: token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke req.user untuk digunakan di route
    next(); // Lanjut ke route
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};

module.exports = verifyToken;
