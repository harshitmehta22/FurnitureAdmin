"use client"
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import { Product } from '../customer/customers-table';
import axios from 'axios';
import Image from 'next/image';



export function LatestProducts(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/latestproducts');
        // Assuming the response returns: { message: "...", products: [...] }
        const data = response.data.products.map((prod: any) => ({
          id: prod._id,
          name: prod.name,
          image: prod.image, // Update if your API uses a different field
          updatedAt: prod.updatedAt,
        }));
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch latest products:', err);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <Card>
      <CardHeader title="Latest products" />
      <Divider />
      <List>
        {products.map((product, index) => (
          <ListItem divider={index < products.length - 1} key={product._id}>
            <ListItemAvatar>
              {product.image ? (
                <Image
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Updated ${dayjs(product.updatedAt).format('MMM D, YYYY')}`}
              secondaryTypographyProps={{ variant: 'body2' }}
            />
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
