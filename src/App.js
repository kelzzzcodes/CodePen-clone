import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Home } from './container'
import { useEffect, useState } from 'react'
import { auth, db } from './config/firebase.config'
import { doc, setDoc } from 'firebase/firestore'
import { Spinner } from './components'
import { useDispatch } from 'react-redux'
import { SET_USER } from './context/actions/userActions';

function App() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCredentials) => {
      if (userCredentials) {
        const userData =userCredentials?.providerData[0]
        console.log(userData)
        setDoc(
          doc(db, 'users', userCredentials?.uid), userData)
          .then(() => {
          //  display the action to store the user
          dispatch(SET_USER(userData))
          navigate('/home/projects', { replace: true })
        })
      } else {
        navigate('/home/auth', { replace: true })
      }

      setInterval(() => {
        setIsLoading(false)
      }, 2000);
    })

    // clean up the listener event handlers
    return () => unsubscribe()
  }, [])

  return (
    <>
      {isLoading ? (
        <div className='w-screen h-screen flex items-center justify-center overflow-hidden '>
         <Spinner/>
        </div>
      ) : (
        <div className="w-screen h-screen flex items-start justify-start overflow-hidden">
          <Routes>
            <Route path="/home/*" element={<Home />} />

            {/* if the route does not match then navigate the user to  /home */}
            <Route path="*" element={<Navigate to={'/home'} />} />
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
