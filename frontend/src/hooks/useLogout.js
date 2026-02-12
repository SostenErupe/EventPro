import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    // Clear from both storages
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}