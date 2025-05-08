'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
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
    stock: '',
    size: '',
    category: '',
    image: null as File | null,
    price: '',
  });

  const [category, setCategory] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const getCategory = async () => {
    const response = await axios.get('http://localhost:5000/api/getcategory');
    setCategory(response.data.categories);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('brand', formData.brand);
    data.append('stock', formData.stock);
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
      setFormData({
        name: '',
        brand: '',
        material: '',
        color: '',
        stock: '',
        size: '',
        category: '',
        image: null,
        price: '',
      });
      onClose();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Automatically derive availability from stock
  const isAvailable = Number(formData.stock) > 0;

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
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={(e) =>
                setFormData(prev => ({ ...prev, category: e.target.value }))
              }
            >
              {category.map((cat: any) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
          />

          <Typography variant="subtitle2" color={isAvailable ? 'green' : 'red'}>
            Status: {isAvailable ? 'In Stock' : 'Out of Stock'}
          </Typography>

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
