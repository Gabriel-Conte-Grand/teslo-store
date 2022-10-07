import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link as MaterialLink,
  Chip,
  Divider,
} from '@mui/material'
import Link from 'next/link'
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form'
import { validations } from '../../utils'
import { tesloApi } from '../api'
import { ErrorOutline } from '@mui/icons-material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context'
import { useRouter } from 'next/router'
import { getProviders, getSession, signIn } from 'next-auth/react'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const [showError, setShowError] = useState(false)

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov)
    })
  }, [])

  const destination = router.query.page?.toString() || '/'

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false)

    await signIn('credentials', { email, password })
  }

  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Iniciar sesión
              </Typography>

              <Chip
                label='Usuario/Contraseña no reconocidos'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'
                label='Correo'
                variant='filled'
                fullWidth
                {...register('email', {
                  required: 'Este campo es necesario',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                type='password'
                variant='filled'
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Minimo 6 carácteres' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                fullWidth
                color='secondary'
                className='circular-btn'
                size='large'
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' flexDirection='column'>
              <Typography variant='subtitle2'>No tienes cuenta?</Typography>
              <Link
                href={
                  destination === '/'
                    ? '/auth/register'
                    : `/auth/register/page=${destination}`
                }
                passHref
              >
                <MaterialLink underline='always'>Crear usuario</MaterialLink>
              </Link>
            </Grid>
            <Grid
              item
              xs={12}
              display='flex'
              flexDirection={'column'}
              justifyContent={'end'}
            >
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials')
                  return <div key='credentials'></div>

                return (
                  <Button
                    key={provider.id}
                    variant='outlined'
                    fullWidth
                    color='primary'
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                )
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req })

  const { page = '/' } = query

  if (session) {
    return {
      redirect: {
        destination: page.toString(),
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default LoginPage
