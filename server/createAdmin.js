const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash('fauzi123', 10); // ganti dengan password yang kamu mau

    const newAdmin = new Admin({
      username: 'fauzi',
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log('Admin berhasil dibuat!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Gagal membuat admin:', error);
    mongoose.disconnect();
  }
}

createAdmin();
