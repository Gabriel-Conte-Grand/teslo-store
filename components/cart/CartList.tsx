import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Divider,
  Grid,
  Link as MaterialLink,
  Typography,
} from '@mui/material'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { FC, useContext } from 'react'
import { CartContext } from '../../context'
import { ICartProduct, IOrderItem, IProduct } from '../../interfaces'
import { ItemCounter } from '../ui'

// const productsInCart = [
//   initialData.products[0],
//   initialData.products[21],
//   initialData.products[44],
// ]

interface Props {
  editable?: boolean
  products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext)

  const onChangeQuantity = (product: ICartProduct, newQuantity: number) => {
    product.quantity = newQuantity

    updateCartQuantity(product)
  }

  const productsToShow = products ? products : cart

  return (
    <>
      {productsToShow.map((product: ICartProduct) => (
        <Grid
          spacing={2}
          sx={{ mb: 1 }}
          container
          key={product.slug + product.size}
        >
          <Grid item xs={3}>
            <Link href={`/product/${product.slug}`} passHref>
              <MaterialLink>
                <CardActionArea>
                  <CardMedia
                    component='img'
                    sx={{ borderRadius: '5px' }}
                    image={product.image}
                  />
                </CardActionArea>
              </MaterialLink>
            </Link>
          </Grid>
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='body1'>{product.title}</Typography>
              <Typography variant='body1'>
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={9}
                  updateQuantity={(value) =>
                    onChangeQuantity(product as ICartProduct, value)
                  }
                />
              ) : (
                <Typography variant='subtitle1'>
                  {product.quantity} {product.quantity > 1 ? 'items' : 'item'}
                </Typography>
              )}
              <Divider />
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display='flex'
            alignItems='center'
            flexDirection='column'
          >
            <Typography variant='subtitle1'>${product.price}</Typography>
            {editable && (
              <Button
                variant='text'
                color='error'
                onClick={() => removeCartProduct(product as ICartProduct)}
              >
                Eliminar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  )
}
