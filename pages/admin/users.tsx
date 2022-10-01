import { PeopleAltOutlined, PeopleOutline } from '@mui/icons-material'
import { NextPage } from 'next'
import { AdminLayout } from '../../components/layouts'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Grid, MenuItem, Select } from '@mui/material'
import useSWR from 'swr'
import { IUser } from '../../interfaces'
import { tesloApi } from '../api'
import { useEffect, useState } from 'react'

const UsersPage: NextPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users')
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  if (!data && !error) return <></>

  const onRoleUpdate = async (userId: string, newRole: string) => {
    const previousUsers = users.map((user) => ({ ...user }))
    const updatedUsers = users.map((user) => ({
      ...user,
      role: user._id === userId ? newRole : user.role,
    }))
    //cambio + rapido los users en tabla, mejor UX
    setUsers(updatedUsers)
    try {
      await tesloApi.put('/admin/users', { userId, role: newRole })
    } catch (error) {
      //si hubo error, la tabla vuelve como antes
      setUsers(previousUsers)
      console.log(error)
      alert('No se pudo actualizar el rol del usuario')
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 250 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 250,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label='Rol'
            onChange={(e) => onRoleUpdate(row.id, e.target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
          </Select>
        )
      },
    },
  ]

  const rows = users!.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }))

  return (
    <AdminLayout
      title={'Usuarios'}
      subTitle={'Mantenimiento de usuarios'}
      icon={<PeopleAltOutlined />}
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

export default UsersPage
