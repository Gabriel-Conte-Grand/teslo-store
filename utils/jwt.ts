import JWT from 'jsonwebtoken'

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - Revistar variables de entorno')
  }

  return JWT.sign(
    //Payload
    { _id, email },
    //Semilla
    process.env.JWT_SECRET_SEED,

    //Opciones
    { expiresIn: '21d' }
  )
}

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - Revistar variables de entorno')
  }

  return new Promise((resolve, reject) => {
    try {
      JWT.verify(token, process.env.JWT_SECRET_SEED || '', (error, payload) => {
        if (error) return reject('El JWT no es válido')

        const { _id } = payload as { _id: string }

        resolve(_id)
      })
    } catch (error) {
      reject('El JWT no es válido')
    }
  })
}
