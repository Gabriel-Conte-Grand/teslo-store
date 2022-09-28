import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Typography, Link as MaterialLink } from '@mui/material'
import { NextPage } from 'next'
import Link from 'next/link'
import { ShopLayout } from '../../components/layouts'

const EmptyPage: NextPage = () => {
  return (
    <ShopLayout
      title='Carrito vacío'
      pageDescription='No hay articulos en el carrito todavía'
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography>Su carrito está vacío</Typography>
          <Link href='/' passHref>
            <MaterialLink typography='h4' color='secondary'>
              Regresar
            </MaterialLink>
          </Link>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage
