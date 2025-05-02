'use client';
import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Stack
} from '@mui/material';
import axios from 'axios';
import { Category } from '../categoryTable/category-table';

type Props = {
    open: boolean;
    onClose: () => void;
    onProductAdded: (category: Category) => Promise<void>;
};

export default function AddCategoryDialog({ open, onClose, onProductAdded }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/category', {
                name: formData.name,
                description: formData.description,
            });
            onProductAdded(response.data);
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
                    <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    );
}
