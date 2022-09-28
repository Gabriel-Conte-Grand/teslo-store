import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material'
import {
  AppBar,
  Toolbar,
  Link as MaterialLink,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Input,
  InputAdornment,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { CartContext, UIContext } from '../../context'

export const Navbar = () => {
  const { pathname, push } = useRouter()

  const { toggleSideMenu } = useContext(UIContext)
  const { numberOfItems } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState('')

  const [isSearching, setIsSearching] = useState(false)

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return

    push(`/search/${searchTerm}`)
  }

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
          <Box
            className='fadeIn'
            sx={{ display: isSearching ? 'none' : { xs: 'none', sm: 'block' } }}
          >
            <Link href='/category/men'>
              <MaterialLink>
                <Button
                  color={pathname === '/category/men' ? 'secondary' : 'info'}
                >
                  Hombres
                </Button>
              </MaterialLink>
            </Link>
            <Link href='/category/women'>
              <MaterialLink>
                <Button
                  color={pathname === '/category/women' ? 'secondary' : 'info'}
                >
                  Mujeres
                </Button>
              </MaterialLink>
            </Link>
            <Link href='/category/kid'>
              <MaterialLink>
                <Button
                  color={pathname === '/category/kid' ? 'secondary' : 'info'}
                >
                  Niños
                </Button>
              </MaterialLink>
            </Link>
          </Box>
          <Box flex={1} />
          {/* Mobile */}
          {isSearching ? (
            <Input
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => (e.key === 'Enter' ? onSearchTerm() : null)}
              type='text'
              autoFocus
              placeholder='Buscar...'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={() => setIsSearching(false)}>
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className='fadeIn'
              onClick={() => setIsSearching(true)}
            >
              <SearchOutlined />
            </IconButton>
          )}

          <IconButton
            sx={{ display: { xs: 'flex', sm: 'none' } }}
            onClick={toggleSideMenu}
          >
            <SearchOutlined />
          </IconButton>

          <Link href='/cart' passHref>
            <MaterialLink>
              <IconButton>
                <Badge
                  badgeContent={numberOfItems > 9 ? '+9' : numberOfItems}
                  color='secondary'
                >
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
            </MaterialLink>
          </Link>
          <Button onClick={toggleSideMenu}>Menú</Button>
        </Toolbar>
      </AppBar>
    </>
  )
}
