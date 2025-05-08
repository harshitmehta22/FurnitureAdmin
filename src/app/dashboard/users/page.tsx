"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { toast, ToastContainer } from 'react-toastify';
import { User, UserTable } from '@/components/userTable/userTable';

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = React.useState([])
  const fetchUsers = async () => {
    const toastId = 'fetch-users-success'; // Unique toast ID
    const errtoastId = 'fetch-users-error'; // Unique toast ID for error
    try {
      const res = await fetch('http://localhost:5000/api/auth/users');
      const data = await res.json();
      setUsers(data.users);
      const message = data?.message || "Users fetched successfully";
      if (!toast.isActive(toastId)) {
        toast.success(message, { toastId });
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      const errorMessage = err?.response?.data?.message || "Failed to fetch users";
      if (!toast.isActive(errtoastId)) {
        toast.error(errorMessage, { toastId: errtoastId });
      }
    }
  }
  React.useEffect(() => {
    fetchUsers();
  }, [])
  const paginatedCustomers = applyPagination(users, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <UserTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: User[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
