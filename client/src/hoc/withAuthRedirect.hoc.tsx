import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActions, useAppSelector } from '../hoooks/redux'

export function withAuthRedirect<WCP extends JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<WCP>) {
  function RedirectComponent(props: WCP) {
    // * Redirect *
    const navigate = useNavigate()
    const { isLoading, isAuth } = useAppSelector((state) => state.authReducer)
    const { setLogModalOpen } = useActions()
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
      setLogModalOpen(false)
      setRedirect(true)
      console.log('in')
    }, [isAuth])

    if (redirect === true) {
      if (!isLoading) {
        if (!isAuth) {
          console.log('out')

          setLogModalOpen(true)
          navigate('/home')
        }
      }
      return <WrappedComponent {...props} />
    }

    return null
  }
  return RedirectComponent
}
