import { ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { CardMedia, Grid, Link as MaterialLink } from '@mui/material'
import { NextPage } from 'next'
import { AdminLayout } from '../../components/layouts'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { IProduct } from '../../interfaces'
import Link from 'next/link'

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia
            component='img'
            alt={row.title}
            className='fadeIn'
            image={`/products/${row.img}`}
          />
        </a>
      )
    },
  },
  {
    field: 'title',
    headerName: 'Título',
    width: 300,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Link href={`/admin/products/${row.slug}`} passHref>
          <MaterialLink underline='always'>{row.title}</MaterialLink>
        </Link>
      )
    },
  },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  {
    field: 'sizes',
    headerName: 'Tallas',
    width: 250,
    align: 'center',
    headerAlign: 'center',
  },
]

const ProductsPage: NextPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products')

  if (!data && !error) return <></>

  const rows = data!.map((product) => ({
    id: product._id,
    slug: product.slug,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(',    '),
  }))

  return (
    <AdminLayout
      title={`Productos (${data?.length})`}
      subTitle={'Mantenimiento de productos'}
      icon={<ProductionQuantityLimitsOutlined />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default ProductsPage
