const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const PEPPER = process.env.PEPPER // Guarda esto en un .env
const SALT_ROUNDS = 10

const hashPassword = async (password) => {
  const peppered = password + PEPPER
  const hashed = await bcrypt.hash(peppered, SALT_ROUNDS)
  return hashed
}

const verifyPassword = async (inputPassword, storedHash) => {
  const peppered = inputPassword + PEPPER
  const match = await bcrypt.compare(peppered, storedHash)
  return match
}

const generateToken = (user) => {
  return jwt.sign(
    { user: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  )
}

exports.register = async (req, res) => {
  const { username, password } = req.body
  const hashed = await hashPassword(password)
  const user = { username, password: hashed }

  try {
    // validar si el usuario ya existe
    const existingUser = await User.findOne({
      where: { username },
    })
  
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
  
    // guardar usuario en la db
    const newUser = {
      "username": username,
      "password": hashed,
    }
  
    await User.create(newUser)
      .catch((error) => {
        return res.status(500).json({ message: `Error creating user ${error}` })
      })
  
    const token = generateToken(user)
  
    res.json({
      user: { id: user.id_user, username: user.username },
      token
    })

  } catch (error) {
    return res.status(500).json({ message: `Error creating user: ${error}` })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  
  try {
    const user = await User.findOne({
      where: { username },
    })
  
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  
    const token = generateToken(user)
    res.json({ username: user.username, token })
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error })
  }
}