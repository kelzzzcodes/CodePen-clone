import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Home, NewProject } from './container'
import { useEffect, useState } from 'react'
import { auth, db } from './config/firebase.config'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { Spinner } from './components'
import { useDispatch } from 'react-redux'
import { SET_USER } from './context/actions/userActions'
import { SET_PROJECTS } from './context/actions/projectActions'

function App() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCredentials) => {
      if (userCredentials) {
        const userData = userCredentials?.providerData[0]
        console.log(userData)
        setDoc(doc(db, 'users', userCredentials?.uid), userData).then(() => {
          //  display the action to store the user
          dispatch(SET_USER(userData))

          navigate('/home/projects', { replace: true })
        })
      } else {
        navigate('/home/auth', { replace: true })
      }
    })

    setInterval(() => {
      setIsLoading(false)
    }, 2000)
    // clean up the listener event handlers
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const projectQuery = query(collection(db,'Projects'), orderBy('id', 'desc'))

    const unsubscribe = onSnapshot(projectQuery, (querySnaps) => {
      const projectList = querySnaps.docs.map((doc) => doc.data())
      dispatch(SET_PROJECTS(projectList))
    })
    return () => unsubscribe()
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden ">
          <Spinner />
        </div>
      ) : (
        <div className="w-screen h-screen flex items-start justify-start overflow-hidden">
          <Routes>
            <Route path="/home/*" element={<Home />} />
            <Route path="newProject" element={<NewProject />} />

            {/* if the route does not match then navigate the user to  /home */}
            <Route path="*" element={<Navigate to={'/home'} />} />
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
