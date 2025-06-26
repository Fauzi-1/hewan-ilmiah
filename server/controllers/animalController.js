const Animal = require('../models/Animal');

// Ambil semua data hewan
exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data hewan.' });
  }
};

// Buat data hewan baru dan simpan link gambar Cloudinary
exports.createAnimal = async (req, res) => {
  try {
    const { name, description, habitat, conservationStatus } = req.body;

    // Ambil URL dari hasil upload Cloudinary (req.file.path)
    const image = req.file ? req.file.path : null;

    const newAnimal = new Animal({
      name,
      description,
      habitat,
      conservationStatus,
      image,
      sound: null // Jika belum pakai Cloudinary untuk suara
    });

    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (err) {
    console.error('Gagal membuat hewan:', err);
    res.status(500).json({ error: 'Gagal membuat hewan baru.' });
  }
};

// Update data hewan
exports.updateAnimal = async (req, res) => {
  try {
    const { name, description, habitat, conservationStatus } = req.body;
    const updateData = {
      name,
      description,
      habitat,
      conservationStatus,
    };

    if (req.file) {
      updateData.image = req.file.path; // Ganti gambar jika ada file baru
    }

    const updated = await Animal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Gagal update hewan:', err);
    res.status(500).json({ error: 'Gagal memperbarui data hewan.' });
  }
};

// Hapus data hewan
exports.deleteAnimal = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hewan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus hewan.' });
  }
};
