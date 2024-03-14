export interface User {
  id: number
  age: number
  name: string
  birthdate: string | Date
  gender: 'male' | 'female'
}
