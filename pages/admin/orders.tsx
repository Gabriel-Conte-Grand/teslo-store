import { ConfirmationNumberTwoTone } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'

import { NextPage } from 'next'
import { AdminLayout } from '../../components/layouts'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { IOrder, IUser } from '../../interfaces'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 250 },
  {
    field: 'total',
    headerName: 'Precio total ($)',
    width: 250,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant='outlined' label='Pagada' color='success' />
      ) : (
        <Chip variant='outlined' label='Pendiente' color='error' />
      )
    },
    width: 150,
  },
  {
    field: 'numberOfItems',
    headerName: 'N° de productos',
    align: 'center',
    width: 150,
  },
  {
    field: 'check',
    headerName: 'Ver órden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
          Ver órden
        </a>
      )
    },
  },
  { field: 'createdAt', headerName: 'Fecha de creación', width: 250 },
]

const OrdersPage: NextPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

  if (!data && !error) return <></>

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    numberOfItems: order.numberOfItems,
    createdAt: order.createdAt?.slice(0, 10),
  }))

  return (
    <AdminLayout
      title={'Órdenes'}
      subTitle={'Mantenimiento de órdenes'}
      icon={<ConfirmationNumberTwoTone />}
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

export default OrdersPage
