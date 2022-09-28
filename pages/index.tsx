import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { Loading } from '../components/ui'
import { useProducts } from '../hooks'

const HomePage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('/products')

  const session = useSession()
  console.log({ session })
  return (
    <ShopLayout
      title={'Teslo-Store'}
      pageDescription={'Encuentra el merchandising oficial de Teslo aquí'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default HomePage
