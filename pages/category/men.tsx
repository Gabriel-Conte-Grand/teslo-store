import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { Loading } from '../../components/ui'
import { useProducts } from '../../hooks'

const MenPage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('/products?gender=men')

  return (
    <ShopLayout
      title={'Teslo-Store | Hombres'}
      pageDescription={'Productos Teslo para hombres'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Sección Hombres
      </Typography>

      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default MenPage
