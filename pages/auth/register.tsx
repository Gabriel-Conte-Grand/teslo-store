import { ErrorOutlineOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link as MaterialLink,
  Chip,
} from '@mui/material'
import { NextPage } from 'next'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../../components/layouts'
import { AuthContext } from '../../context'
import { validations } from '../../utils'

type FormData = {
  name: string
  email: string
  password: string
}

const RegisterPage: NextPage = () => {
  const { registerUser } = useContext(AuthContext)
  const router = useRouter()

  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const destination = router.query.page?.toString() || '/'

  const onSubmitRegister = async (newUserData: FormData) => {
    setShowError(false)
    const { email, name, password } = newUserData

    const { hasError, message } = await registerUser(name, email, password)

    if (hasError) {
      setShowError(true)
      setErrorMessage(message!)
      setTimeout(() => {
        setShowError(false)
      }, 4500)
      return
    }

    await signIn('credentials', { email, password })
  }

  return (
    <AuthLayout title={'Registro de cuenta'}>
      <form onSubmit={handleSubmit(onSubmitRegister)}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Nueva Cuenta
              </Typography>
              <Chip
                label='La cuenta no pudo ser creada'
                color='error'
                className='fadeIn'
                icon={<ErrorOutlineOutlined />}
                sx={{ display: showError ? 'flex' : 'none', mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Nombre Completo'
                variant='filled'
                fullWidth
                {...register('name', {
                  required: 'Debes ingresar un nombre de usuario',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 carácteres',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Correo'
                variant='filled'
                fullWidth
                {...register('email', {
                  required: 'Se necesita un correo electrónico',
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
                  required: 'Debes ingresar una contraseña',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 carácteres',
                  },
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
                Registrar Cuenta
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' flexDirection='column'>
              <Typography variant='subtitle2'>Ya tienes cuenta?</Typography>
              <Link
                href={
                  destination === '/'
                    ? '/auth/login'
                    : `auth/login/page=${destination}`
                }
                passHref
              >
                <MaterialLink underline='always'>Iniciar sesión</MaterialLink>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

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

export default RegisterPage
