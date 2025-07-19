const Animal = require('../models/Animal');

exports.getAllAnimals = async (req, res) => {
  try {
    const { name } = req.query;

    let animals;
    if (name) {
      animals = await Animal.find({
        name: { $regex: new RegExp(name, 'i') }  // pencarian case-insensitive
      });
    } else {
      animals = await Animal.find();
    }

    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data hewan.' });
  }
};


exports.createAnimal = async (req, res) => {
  try {
    const { name, description, habitat, conservationStatus } = req.body;

    const image = req.file ? req.file.path : null;

    const newAnimal = new Animal({
      name,
      description,
      habitat,
      conservationStatus,
      image,
    });

    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (err) {
    console.error('Gagal membuat hewan:', err);
    res.status(500).json({ error: 'Gagal membuat hewan baru.' });
  }
};

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
      updateData.image = req.file.path; 
    }

    const updated = await Animal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Gagal update hewan:', err);
    res.status(500).json({ error: 'Gagal memperbarui data hewan.' });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hewan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus hewan.' });
  }
};
