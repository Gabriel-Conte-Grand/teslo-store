import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  Link as MaterialLink,
  Chip,
} from '@mui/material'
import Link from 'next/link'
import { FC, useMemo, useState } from 'react'
import { IProduct } from '../../interfaces'

interface Props {
  product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)

  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0]
  }, [isHovered, product.images])

  return (
    <Grid
      item
      key={product.slug}
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <Link href={`/product/${product.slug}`} passHref prefetch={false}>
          <MaterialLink>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  sx={{
                    position: 'absolute',
                    zIndex: 99,
                    top: '10px',
                    left: '10px',
                  }}
                  color='primary'
                  label='Fuera de stock'
                />
              )}
              <CardMedia
                className='fadeInImage'
                component='img'
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </MaterialLink>
        </Link>
      </Card>

      <Box
        sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
        className='fadeIn'
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  )
}
