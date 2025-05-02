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

export default function AddEmployeeDialog({ open, onClose, onProductAdded }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        position: '',
        salary: '',
        joiningDate: new Date().toISOString().split('T')[0],
        photo: null as File | null,
        idProof: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'idProof') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = async () => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('address', formData.address);
        data.append('phone', formData.phone);
        data.append('position', formData.position);
        data.append('salary', formData.salary);
        data.append('joiningDate', formData.joiningDate);

        if (formData.photo) {
            data.append('photo', formData.photo);
        }
        if (formData.idProof) {
            data.append('idProof', formData.idProof);
        }

        try {
            await axios.post('http://localhost:5000/api/employee', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // await onProductAdded(); // Pass the new category object
            onClose();
        } catch (err) {
            console.error('Error adding employee:', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Employee</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
                    <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth />
                    <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
                    <TextField label="Position" name="position" value={formData.position} onChange={handleChange} fullWidth />
                    <TextField label="Salary" name="salary" value={formData.salary} onChange={handleChange} fullWidth />
                    <TextField label="Date of Joining" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />

                    <Button variant="outlined" component="label">
                        Upload Photo
                        <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                    </Button>
                    {formData.photo && <div>Selected Photo: {formData.photo.name}</div>}

                    <Button variant="outlined" component="label">
                        Upload ID Proof
                        <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'idProof')} />
                    </Button>
                    {formData.idProof && <div>Selected ID Proof: {formData.idProof.name}</div>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    );
}
