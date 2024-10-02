import React, { useState } from "react";
import { Container, Row } from 'react-bootstrap';
import logo from 'src/assets/images/logo.png'
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { useEffect } from "react";
const API_URL = "https://insuranceapi-3o5t.onrender.com"
const ResetPassword = () => {
  const navigate = useNavigate();
  const [Loading, setisLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);
  // Validate Lower case letters
  var lowerCaseLetters = /[a-z]/g;
  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  // Validate numbers
  var numbers = /[0-9]/g;
  // special Characters numbers
  var specialChar =
    /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
  const { token } = useParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(formData.email);
    e.preventDefault();

    try {
      if (!lowerCaseLetters.test(formData.password)) {
        swal("Please Enter at least one Lowercase character");
      } else if (!upperCaseLetters.test(formData.password)) {
        swal("Please Enter at least  one upper Case character");
      } else if (!numbers.test(formData.password)) {
        swal("Please Enter at least one  number ");
      } else if (!specialChar.test(formData.password)) {
        swal("Please Enter at least one  special character ");
      } else if (formData.password !== formData.cpassword) {
        swal("Password not match!");
      } else {
        const data = {
          password: formData.password,
        };
        console.log("token>>>>>>", token)

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer" + ' ' + token,
          },
          body: JSON.stringify(data),
        };
        setisLoading(true);
        await fetch(API_URL + "/api/forgotPassword?admin=1", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 200) {
              localStorage.setItem("token", data.data.token);

              localStorage.setItem("user", JSON.stringify(data.data));
              setisLoading(false);
              const usertype = data.data.usertype;
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
              else {
                window.location.href = '/admin'
              }
            } else {
              setisLoading(false);
              setError(true);
              setErrorMessage(data.message);
              swal({
                title: "Error!",
                text: data.message,
                type: "error",
                icon: "error",
              }).then(function () { });
            }
          });
      }
    } catch (err) {
      setisLoading(false);
      setError(true);
      console.log(err);
    }
  };
  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  return (
    <>
      <Container>
        <Link to="/Login"><img style={{ width: '80px', marginTop: '20px', marginBottom: '20px' }} src={logo} /></Link>
        <div className="login-container">
          <div className="login-form">
            <div className="login-form-inner">
              <h5>Reset Your Password</h5>
              <h4>Confirm Your Password</h4>
              <form name="signin" className="form" action="/" method="POST" onSubmit={handleSubmit} >
                <div className="login-form-group">
                  <label htmlFor="email">Password <span className="required-star">*</span></label>
                  <input onChange={handleChange} type="password" name="password" placeholder="Enter Password" id="email" />
                </div>
                <div className="login-form-group">
                  <label htmlFor="pwd">Confirm Password <span className="required-star">*</span></label>
                  <input onChange={handleChange} autoComplete="off" type="password" name="password" placeholder="Enter Confirm Password" id="pwd" />
                </div>
                <div className="login-form-group single-row">
                  <div className="custom-check">
                    <input autoComplete="off" type="checkbox" defaultChecked id="remember" /><label htmlFor="remember">Remember me</label>
                  </div>
                </div>
                <button
                  onKeyUp={handleEnter}
                  onClick={handleSubmit}
                  type="submit" className="rounded-button login-cta"
                  id="submitbtn">Submit</button>
                <div className="register-div">Already a user? <Link to="/Forgetpassword" className="Login">Sign In</Link></div>
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
            © Company 2023 All Rights Reserved
          </p>
        </div>
      </div>


    </>
  )
}

export default ResetPassword
