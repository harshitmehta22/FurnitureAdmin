"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Employee, EmployeeTable } from '@/components/employeeTable/employee-table';
import AddEmployeeDialog from '@/components/addEmployeeDialog';

export default function Page(): React.JSX.Element {
    const page = 0;
    const rowsPerPage = 5;
    const [category, setCategory] = useState([])
    const fetchCustomers = async () => {
        const toastId = 'fetch-category-success'; // Unique toast ID
        const errtoastId = 'fetch-category-error'; // Unique toast ID for error
        try {
            const res = await axios.get('http://localhost:5000/api/allemployee');
            console.log(res, "res")
            setCategory(res.data.employees);
            console.log(category, "category")
            const message = res.data?.message || "Categories fetched successfully";
            if (!toast.isActive(toastId)) {
                toast.success(message, { toastId });
            }

        } catch (err: any) {
            console.error('Failed to fetch category:', err);
            const errorMessage = err?.response?.data?.message || "Failed to fetch categories";
            if (!toast.isActive(errtoastId)) {
                toast.error(errorMessage, { toastId: errtoastId });
            }
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
    console.log(category, "category")


    const paginatedCustomers = applyPagination(category, page, rowsPerPage);

    return (
        <Stack spacing={3}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Employee</Typography>
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
            <CustomersFilters />
            <EmployeeTable
                count={paginatedCustomers.length}
                page={page}
                onProductUpdate={fetchCustomers}
                rows={paginatedCustomers}
                rowsPerPage={rowsPerPage}
            />
            <AddEmployeeDialog
                open={openAddDialog}
                onClose={handleCloseDialog}
                onProductAdded={fetchCustomers}
            />
        </Stack>
    );
}

function applyPagination(rows: Employee[], page: number, rowsPerPage: number): Employee[] {
    if (!Array.isArray(rows)) return [];
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}