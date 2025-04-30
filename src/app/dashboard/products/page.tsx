"use client"
import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Product } from '@/components/dashboard/customer/customers-table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddProductDialog from '@/components/addProductDialog';

// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

// const products = [
//   {
//     id: 'USR-010',
//     name: 'Alcides Antonio',
//     avatar: '/assets/avatar-10.png',
//     email: 'alcides.antonio@devias.io',
//     phone: '908-691-3242',
//     address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-009',
//     name: 'Marcus Finn',
//     avatar: '/assets/avatar-9.png',
//     email: 'marcus.finn@devias.io',
//     phone: '415-907-2647',
//     address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-008',
//     name: 'Jie Yan',
//     avatar: '/assets/avatar-8.png',
//     email: 'jie.yan.song@devias.io',
//     phone: '770-635-2682',
//     address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-007',
//     name: 'Nasimiyu Danai',
//     avatar: '/assets/avatar-7.png',
//     email: 'nasimiyu.danai@devias.io',
//     phone: '801-301-7894',
//     address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-006',
//     name: 'Iulia Albu',
//     avatar: '/assets/avatar-6.png',
//     email: 'iulia.albu@devias.io',
//     phone: '313-812-8947',
//     address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-005',
//     name: 'Fran Perez',
//     avatar: '/assets/avatar-5.png',
//     email: 'fran.perez@devias.io',
//     phone: '712-351-5711',
//     address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },

//   {
//     id: 'USR-004',
//     name: 'Penjani Inyene',
//     avatar: '/assets/avatar-4.png',
//     email: 'penjani.inyene@devias.io',
//     phone: '858-602-3409',
//     address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-003',
//     name: 'Carson Darrin',
//     avatar: '/assets/avatar-3.png',
//     email: 'carson.darrin@devias.io',
//     phone: '304-428-3097',
//     address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-002',
//     name: 'Siegbert Gottfried',
//     avatar: '/assets/avatar-2.png',
//     email: 'siegbert.gottfried@devias.io',
//     phone: '702-661-1654',
//     address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-001',
//     name: 'Miron Vitold',
//     avatar: '/assets/avatar-1.png',
//     email: 'miron.vitold@devias.io',
//     phone: '972-333-4106',
//     address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
// ] satisfies Customer[];

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
            <CustomersFilters />
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