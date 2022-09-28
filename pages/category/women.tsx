import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { Loading } from '../../components/ui'
import { useProducts } from '../../hooks'

const WomenPage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('/products?gender=women')

  return (
    <ShopLayout
      title={'Teslo-Store | Mujeres'}
      pageDescription={'Productos Teslo para mujeres'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Sección Mujeres
      </Typography>

      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default WomenPage
