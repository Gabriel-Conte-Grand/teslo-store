import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs'
import { jwt, validations } from '../../../utils'

type Data =
  | { message: string }
  | { token: string; user: { name: string; role: string; email: string } }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res)

    default:
      res.status(400).json({
        message: 'Bad Request',
      })
  }
}
const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { email = '', password = '', name = '' } = req.body

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'La contraseña no tiene más de 5 caracteres.' })
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: 'El nombre debe ser mayor a 2 caracteres.' })
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({
      message: 'Tipo de correo no admitido.',
    })
  }

  await db.connect()

  const user = await User.findOne({ email })

  await db.disconnect()

  if (user) {
    return res
      .status(400)
      .json({ message: 'El correo ya existe en nuestra base de datos' })
  }

  const newUser = new User({
    email: email.toLowerCase(),
    name,
    password: bcrypt.hashSync(password),
    role: 'client',
  })

  try {
    await newUser.save({ validateBeforeSave: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Revisar logs del servidor' })
  }

  const { _id } = newUser

  const token = jwt.signToken(_id, email)

  res.status(200).json({
    token,
    user: {
      name,
      email,
      role: 'client',
    },
  })
}
