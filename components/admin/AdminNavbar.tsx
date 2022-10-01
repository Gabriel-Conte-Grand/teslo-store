import {
  AppBar,
  Toolbar,
  Link as MaterialLink,
  Typography,
  Box,
  Button,
} from '@mui/material'
import Link from 'next/link'
import { FC, useContext, useState } from 'react'
import { UIContext } from '../../context'

export const AdminNavBar: FC = () => {
  const { toggleSideMenu } = useContext(UIContext)

  return (
    <>
      <AppBar>
        <Toolbar>
          <Link href='/' passHref>
            <MaterialLink display='flex' alignItems='center'>
              <Typography variant='h6'>Teslo |</Typography>
              <Typography sx={{ ml: 0.5 }}>Store</Typography>
            </MaterialLink>
          </Link>
          <Box flex={1} />
          {/* Asi saco con Material los bottones en pantallas chicas */}

          <Button onClick={toggleSideMenu}>Menú</Button>
        </Toolbar>
      </AppBar>
    </>
  )
}
