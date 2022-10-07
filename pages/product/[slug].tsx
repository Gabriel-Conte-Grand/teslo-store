import { useContext, useState } from 'react'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ShopLayout } from '../../components/layouts'
import { ProductSlideShow, SizeSelector } from '../../components/products'
import { ItemCounter } from '../../components/ui'
import { ICartProduct, IProduct, ISize } from '../../interfaces'

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {
  console.log(product)
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const { addProductToCart } = useContext(CartContext)

  const router = useRouter()

  const onSizeChange = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }))
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity,
    }))
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return null

    addProductToCart(tempCartProduct)
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          {/* Titulos */}
          <Box display='flex' flexDirection='column'>
            <Typography variant='h1' component='h1'>
              {product.title}
            </Typography>
            <Typography variant='subtitle1' component='h2'>
              ${product.price}
            </Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={updateQuantity}
                maxValue={product.inStock > 10 ? 10 : product.inStock} //si hay mucho stock, hasta 10 items en una compra
              />
              <SizeSelector
                selectedSizes={tempCartProduct.size}
                sizes={product.sizes}
                onSizeChange={onSizeChange}
              />
            </Box>
            {product.inStock > 0 ? (
              <Button
                onClick={onAddProduct}
                color='secondary'
                className='circular-btn'
              >
                {tempCartProduct.size
                  ? 'Agregar al carrito'
                  : 'Seleccione un talle'}
              </Button>
            ) : (
              <Chip
                label='No hay disponibilidad'
                color='error'
                variant='outlined'
              />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
import { GetStaticPaths } from 'next'
import { dbProducts } from '../../database'

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlug() // your fetch function here

  return {
    paths: slugs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
import { GetStaticProps } from 'next'
import { CartContext } from '../../context'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }

  const product = await dbProducts.getProductBySlug(slug) // your fetch function here

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      product,
    },
    revalidate: 86400,
  }
}

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug } = params as { slug: string }

//   const product = await dbProducts.getProductBySlug(slug) // your fetch function here

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: { product },
//   }
// }

export default ProductPage
