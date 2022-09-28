import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { Loading } from '../../components/ui'
import { useProducts } from '../../hooks'

const KidPage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('/products?gender=kid')

  return (
    <ShopLayout
      title={'Teslo-Store | Niños'}
      pageDescription={'Productos Teslo para niños'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Sección Niños
      </Typography>

      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default KidPage
