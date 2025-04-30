'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
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
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import dummyShoe from '../../../../public/assets/shoe.png';
import { useSelection } from '@/hooks/use-selection';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import axios from 'axios';
function noop(): void {
  // do nothing
}

export interface Product {
  _id: string;
  avatar: string;
  name: string;
  brand: string;
  material: string;
  image: string;
  size: number;
  price: number;
  category: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Product[];
  rowsPerPage?: number;
  onProductUpdate?: (product: Product) => void;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onProductUpdate
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer._id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [editOpen, setEditOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<Product | null>(null);
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-product/${id}`);
      if (onProductUpdate) {
        const deletedProduct = rows.find((row) => row._id === id);
        if (deletedProduct) {
          onProductUpdate(deletedProduct);
        }
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <Card>
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
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Price</TableCell>
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
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Image
                        src={`http://localhost:5000/uploads/${row.image}`}
                        alt={row.name}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                      />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.brand}</TableCell>
                  <TableCell>
                    {row.category}
                  </TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{row.material}</TableCell>
                  <TableCell>{row.price}</TableCell>

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
                <TextField label="Brand" fullWidth value={editData.brand}
                  onChange={(e) => setEditData({ ...editData, brand: e.target.value })} />
                <TextField label="Category" fullWidth value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                <TextField label="Material" fullWidth value={editData.material}
                  onChange={(e) => setEditData({ ...editData, material: e.target.value })} />
                <TextField label="Size" fullWidth type="number" value={editData.size}
                  onChange={(e) => setEditData({ ...editData, size: +e.target.value })} />
                <TextField label="Price" fullWidth type="number" value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: +e.target.value })} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    await axios.put(`http://localhost:5000/api/editproduct/${editData._id}`, editData);
                    setEditOpen(false);
                    if (onProductUpdate) {
                      onProductUpdate(editData); // optional: refresh data from parent or show snackbar
                    }
                  } catch (err) {
                    console.error('Failed to update product', err);
                  }
                }}
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
