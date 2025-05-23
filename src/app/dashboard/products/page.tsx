"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Product } from '@/components/dashboard/customer/customers-table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddProductDialog from '@/components/addProductDialog';

export default function Page(): React.JSX.Element {
    const page = 0;
    const rowsPerPage = 5;
    const [products, setProducts] = useState([])
    const fetchCustomers = async () => {
        try {
            const res = await axios(' http://localhost:5000/api/getproduct');
            console.log(res, "repsonse/")
            setProducts(res.data.product);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        }
    };
    useEffect(() => {
        fetchCustomers();
    }, []);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleAddProduct = () => {
        setOpenAddDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenAddDialog(false);
    };


    const paginatedCustomers = applyPagination(products, page, rowsPerPage);

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Products</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Import
                        </Button>
                        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Export
                        </Button>
                    </Stack>
                </Stack>
                <div>
                    <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAddProduct}>
                        Add
                    </Button>
                </div>
            </Stack>
            <CustomersTable
                count={paginatedCustomers.length}
                page={page}
                onProductUpdate={fetchCustomers}
                rows={paginatedCustomers}
                rowsPerPage={rowsPerPage}
            />
            <AddProductDialog
                open={openAddDialog}
                onClose={handleCloseDialog}
                onProductAdded={fetchCustomers}
            />
        </Stack>
    );
}

function applyPagination(rows: Product[], page: number, rowsPerPage: number): Product[] {
    if (!Array.isArray(rows)) return [];
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}