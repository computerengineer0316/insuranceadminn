import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import logo from 'src/assets/images/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
const API_URL = "https://insuranceapi-3o5t.onrender.com"
const Forgetpassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        console.log(formData.email)
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            swal({
                title: "Error!",
                text: "Please enter a valid email address.",
                type: "error",
                icon: "error"
            }).then(function () {
                return false;
            });
        }

        try {
            if (formData.email) {
                const requestOptions =
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                await fetch(API_URL + '/api/emailVerification?admin=1&email=' + formData.email, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 200) {
                            swal({
                                title: "Success!",
                                text: data.message,
                                type: "success",
                                icon: "success"
                            }).then(function () {
                                // navigate('/');
                            });
                        }
                        else {
                            swal({
                                title: "Error!",
                                text: data.message,
                                type: "error",
                                icon: "error"
                            }).then(function () {
                                // navigate('/');
                            });
                        }
                    });
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Container>
                <Link to="/Login"><img style={{ width: '80px', marginTop: '20px', marginBottom: '20px' }} src={logo} /></Link>
                <div className="login-container">
                    <div className="login-form">
                        <div className="login-form-inner">
                            <h5>Forgot Password?</h5>
                            <h4>You can reset your password here.</h4>
                            <form name="signin" className="form" action="/" method="POST" onSubmit={handleSubmit} >
                                <div className="login-form-group">
                                    <label htmlFor="email">Email <span className="required-star">*</span></label>
                                    <input onChange={handleChange} type="email" name="email" placeholder="Enter Email" id="email" />
                                </div>
                                <div className="login-form-group single-row">
                                    <div className="custom-check">
                                        <input autoComplete="off" type="checkbox" defaultChecked id="remember" /><label htmlFor="remember">Remember me</label>
                                    </div>
                                </div>
                                <button onClick={handleSubmit} type="submit" className="rounded-button login-cta"
                                    id="submitbtn">Send Email</button>
                                <div className="register-div">Already a user? <Link to="/Login" className="link forgot-link">Login</Link></div>
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

export default Forgetpassword