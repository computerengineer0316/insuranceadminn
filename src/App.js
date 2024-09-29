import React, { useEffect, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import Forgetpassword from './views/pages/login/Forgetpassword'
import ResetPassword from './views/pages/login/ResetPassword'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const VerifyOtp = React.lazy(() => import('./views/pages/login/VerifyOtp'))

const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

function App() {
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('user'))
    if (userdata != null) {
      const user_id = userdata._id
      userdetails(user_id)
    }
  }, [])


  const userdetails = (user_id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_staff_details/${user_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.data))
      })
      .catch((err) => console.log(err))
  }

  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route path="/VerifyOtp" name="Motor Quote" element={<VerifyOtp />} />

          <Route path="/ForgetPassword" name="Home" element={<Forgetpassword />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )

}

export default App
