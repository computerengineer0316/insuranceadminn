import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import logo from 'src/assets/images/logo.png'
const Login = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  if (token) {
    window.location.href = '/admin'
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailotp, setEmailotp] = useState('')



  const handleSubmit = async (e) => {
    e.preventDefault()
    // const data = new FormData(e.target)
    // const email = data.get('email')
    // const password = data.get('password')
    const user = { email, password }
    console.log(user)
    const response = await axios.post('https://insuranceapi-3o5t.onrender.com/api/login', user)
    if (response.data.status === 200) {
      console.log(response.data.data)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      const usertype = response.data.data.usertype;
      if (usertype === '646224deb201a6f07b2dff32') {
        window.location.href = '/ManageSupervisorDashboard'
      }
      else if (usertype === '646224eab201a6f07b2dff36') {
        window.location.href = '/salesDashboard'
      }
      else if (usertype === '6462250eb201a6f07b2dff3a') {
        window.location.href = '/documentchaserDashboard'
      }
      else if (usertype === '64622526b201a6f07b2dff3e') {
        window.location.href = '/policyissuerdashboard'
      }
      else if (usertype === '650029a2df69a4033408903d') {
        window.location.href = '/operations'
      }
      else if (usertype === '653604248028cba2487f7d2a') {
        window.location.href = '/insurancecompanydashboard'
      } else if (usertype === "66068569e8f96a29286c956e") {
        window.location.href = '/ProducerDashboard'
      }
      else {
        window.location.href = '/admin'
      }

    }
    else {
      swal({
        title: "Error!",
        text: response.data.message,
        type: "error",
        icon: "error"
      }).then(function () {
        navigate('/login')
      });
    }
  }


  const handleotplogin = async (e) => {
    e.preventDefault()
    try {

      console.log(emailotp)
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailotp,
        }),
      };
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/send_otp_email_admin`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            console.log(data)
            localStorage.setItem('email', emailotp)
            navigate('/VerifyOtp')
          }
          else {
            swal({
              text: data.message,
              type: "warning",
              icon: "warning"
            }).then(function () {
              navigate('/login')
            });
          }
        })

    } catch (err) {
      console.log(err)
    }

  }


  return (
    <>
      <Container>
        <Link to="/Login"><img style={{ width: '80px', marginTop: '20px', marginBottom: '20px' }} src={logo} /></Link>
        <div className="login-container">
          <div className="login-form">
            <div className="login-form-inner">
              <h5>Welcome Back</h5>
              <h4>Login to the Dashboard</h4>
              <form name="signin" className="form" >
                <div className="login-form-group">
                  <label htmlFor="email">Email <span className="required-star">*</span></label>
                  <input type="text" name="email" placeholder="Enter Email" id="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="login-form-group">
                  <label htmlFor="pwd">Password <span className="required-star">*</span></label>
                  <input autoComplete="off" type="password" name="password" placeholder="Enter Password" defaultValue={password} id="pwd" onChange={(e) => setPassword(e.target.value)} />
                </div>
                {/* <div className="login-form-group single-row">
                  <div className="custom-check">
                    <input autoComplete="off" type="checkbox" defaultChecked id="remember" /><label htmlFor="remember">Remember me</label>
                  </div>
                </div> */}
                <button type="submit" className="rounded-button login-cta" id="submitbtn" onClick={handleSubmit}>
                  Login
                </button>
                <span className="or mb-2">---- OR ----</span>
                <div className="login-form-group">
                  <label htmlFor="email">Email <span className="required-star">*</span></label>
                  <input type="text" name="email" placeholder="Enter Email" defaultValue={emailotp} onChange={(e) => setEmailotp(e.target.value)} />
                </div>
                <button type="submit" className="rounded-button login-cta" onClick={handleotplogin}>
                  Login via OTP
                </button>


                <div className="register-div">Trouble in login? <Link to="/Forgetpassword" className="link forgot-link">Forgot Password ?</Link></div>
              </form>
            </div>
          </div>
          <div className="onboarding">
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide color-1">
                  <div className="slide-image">
                    <img src="https://media.istockphoto.com/id/1281150061/vector/register-account-submit-access-login-password-username-internet-online-website-concept.jpg?b=1&s=612x612&w=0&k=20&c=9H5N9Jy8BA9yCzL-Wt5uCeZqETmpPYsJKJ2Nh1-SDaw=" loading="lazy" alt="" />
                  </div>
                  <div className="slide-content">
                    <h2>Last Minute Policy</h2>
                    <p>Powered by Test</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div
        className="row"
        style={{
          color: "white",
          textAlign: "center",
          background: "#003096",
          paddingTop: 11
        }}
      >
        <div className="col-lg-12">
          <p className="copyright12" style={{ fontSize: '14px' }}>
            © Company 2024 All Rights Reserved
          </p>
        </div>
      </div>


    </>
  )
}

export default Login
