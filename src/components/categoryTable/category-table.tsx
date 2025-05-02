'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
function noop(): void {
    // do nothing
}

export interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: Date;
}

interface CategoryTableProps {
    count?: number;
    page?: number;
    rows?: Category[];
    rowsPerPage?: number;
    onProductUpdate?: () => void;
}


export function CategoryTable({
    count = 0,
    rows = [],
    page = 0,
    rowsPerPage = 0,
    onProductUpdate
}: CategoryTableProps): React.JSX.Element {
    const rowIds = React.useMemo(() => {
        return rows.map((category) => category._id);
    }, [rows]);

    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
    const selectedAll = rows.length > 0 && selected?.size === rows.length;
    const [editOpen, setEditOpen] = React.useState(false);
    const [editData, setEditData] = React.useState<Category | null>(null);
    const handleDelete = async (id: string) => {
        const toastId = 'delete-category-success';
        const errtoastId = 'delete-category-error';
        try {
            await axios.delete(`http://localhost:5000/api/delete-category/${id}`);
            if (onProductUpdate) {
                onProductUpdate(); // This fetches data again from parent
                window.location.reload();
            }
            if (!toast.isActive(toastId)) {
                toast.success('Category deleted successfully!', { toastId });
            }
        } catch (err) {
            console.error('Failed to delete category', err);
            if (!toast.isActive(errtoastId)) {
                toast.error('error oming', { toastId: errtoastId });
            }
        }
    };

    const handleEdit = async () => {
        try {
            if (editData) {
                await axios.put(`http://localhost:5000/api/editcategory/${editData._id}`, editData);
            }
            setEditOpen(false);
            if (onProductUpdate) {
                onProductUpdate(); // optional: refresh data from parent or show snackbar
            }
        } catch (err) {
            console.error('Failed to update product', err);
        }
    }

    return (
        <Card>
            {/* <ToastContainer
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
            /> */}
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAll}
                                    indeterminate={selectedSome}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            selectAll();
                                        } else {
                                            deselectAll();
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            const isSelected = selected?.has(row._id);
                            return (
                                <TableRow hover key={row._id} selected={isSelected}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    selectOne(row._id);
                                                } else {
                                                    deselectOne(row._id);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        {row.description}
                                    </TableCell>
                                    <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                                    <TableCell> <Stack direction="row" spacing={1}>
                                        <IconButton size="small" onClick={() => {
                                            setEditData(row);
                                            setEditOpen(true);
                                        }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(row._id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
            <Divider />
            <TablePagination
                component="div"
                count={count}
                onPageChange={noop}
                onRowsPerPageChange={noop}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            {editData && (
                <>
                    <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField label="Name" fullWidth value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                <TextField label="Brand" fullWidth value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={handleEdit}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Card>
    );
}
