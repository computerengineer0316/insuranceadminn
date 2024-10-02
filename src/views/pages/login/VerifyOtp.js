import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import logo from 'src/assets/images/logo.png'
const VerifyOtp = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    if (token) {
        window.location.href = '/admin'
    }

    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(60);

    useEffect(() => {
        let timer;
        if (isCooldown) {
            timer = setInterval(() => {
                setCooldownTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setIsCooldown(false);
                        setCooldownTime(60);
                        return 60;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCooldown]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        // const data = new FormData(e.target)
        const emaildata = localStorage.getItem('email')
        const otpdata = otp.join('')
        const user = { email: emaildata, otp: otpdata }
        console.log(user)
        const response = await axios.post('https://insuranceapi-3o5t.onrender.com/api/verify_otp_admin', user)
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

    const handleResendOtp = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("email"),
                }),
            };
            await fetch("https://insuranceapi-3o5t.onrender.com/api/send_otp_email_admin", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setIsCooldown(true);
                })
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <>
            <Container>
                <Link to="/Login"><img style={{ width: '80px', marginTop: '20px', marginBottom: '20px' }} src={logo} /></Link>
                <div className="login-container">
                    <div className="login-form">
                        <div className="login-form-inner">
                            <h5>Welcome Back</h5>
                            <h4>Enter OTP to Login to the Dashboard</h4>
                            <form name="signin" className="form" >
                                <div className="otp-box">
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                key={index}
                                                className="otp-field"
                                                type="text"
                                                name="otp"
                                                maxLength="1"
                                                value={data}
                                                onChange={(e) => handleChange(e.target, index)}
                                                onFocus={(e) => e.target.select()}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    textAlign: "center",
                                                    fontSize: "1.5rem",
                                                    fontWeight: "bold",
                                                    border: "1px solid #ced4da",
                                                    borderRadius: "4px",
                                                    outline: "none",
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                                <button type="submit" className="rounded-button login-cta" onClick={handleSubmit}>
                                    Login via OTP
                                </button>
                                <button
                                    type="button"
                                    className="rounded-button login-cta"
                                    style={{ backgroundColor: isCooldown ? '#ccc' : '#ED1C24', cursor: isCooldown ? 'not-allowed' : 'pointer', border: '#ED1C24' }}
                                    onClick={isCooldown ? null : handleResendOtp}
                                    disabled={isCooldown}>
                                    {isCooldown ? `Resend OTP in ${cooldownTime}s` : 'Resend OTP'}
                                </button>

                                {/* <div className="register-div">Trouble in login? <Link to="/Forgetpassword" className="link forgot-link">Forgot Password ?</Link></div> */}
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

export default VerifyOtp
