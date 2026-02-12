import { useAuthStore } from '@/stores/useAuthStore'
import React from 'react'
import { useNavigate } from 'react-router'

const Logout = () => {
    const { logOut } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async( )=>{
        try {
            await logOut()
            navigate('/signin')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
      <button type="button" className=' bg-amber-800' onClick={handleLogout}> logout</button>
    </div>
  )
}

export default Logout
