// services/UserService.ts
import axios from 'axios'
import { User } from '@/types'

const API_URL = 'https://6543b34101b5e279de20d19f.mockapi.io/api/v1/users/'

// Use the Userinterface to type the return value of getUser
export const getUser = async (userId: string): Promise<User> => {
  const { data } = await axios.get<User>(`${API_URL}${userId}`)
  return data
}

// Use the Userinterface for the UserData parameter and return value of updateUser
export const updateUser = async (
  userId: string,
  UserData: User,
): Promise<User> => {
  const { data } = await axios.put<User>(`${API_URL}${userId}`, UserData)
  return data
}
