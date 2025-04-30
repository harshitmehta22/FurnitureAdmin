'use client';
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack
} from '@mui/material';
import axios from 'axios';

type Props = {
  open: boolean;
  onClose: () => void;
  onProductAdded: () => void;
};

export default function AddProductDialog({ open, onClose, onProductAdded }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    material: '',
    color: '',
    size: '',
    category: '',
    image: null as File | null,
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('brand', formData.brand);
    data.append('material', formData.material);
    data.append('size', formData.size);
    data.append('category', formData.category);
    data.append('color', formData.color);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:5000/api/addproduct', data);
      onProductAdded();
      onClose();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Price" name="price" value={formData.price} onChange={handleChange} fullWidth />
          <TextField label="Material" name="material" value={formData.material} onChange={handleChange} fullWidth />
          <TextField label="Brand" name="brand" value={formData.brand} onChange={handleChange} fullWidth />
          <TextField label="Size" name="size" value={formData.size} onChange={handleChange} fullWidth />
          <TextField label="Category" name="category" value={formData.category} onChange={handleChange} fullWidth />
          <TextField label="Color" name="color" value={formData.color} onChange={handleChange} fullWidth />

          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {formData.image && <div>Selected: {formData.image.name}</div>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
