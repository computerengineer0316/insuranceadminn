import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const userdata = JSON.parse(localStorage.getItem('user'));
            setProfile(userdata);
        }
    }, []);

    const changePassword = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const password = data.get('password');
        const cpassword = data.get('cpassword');
        const profileid = data.get('profile_id');

        if (password !== cpassword) {
            swal({
                title: "Error!",
                text: "Password and Confirm Password does not match",
                type: "error",
                icon: "error"
            });
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password, profileid: profileid })
            };
            fetch('https://insuranceapi-3o5t.onrender.com/api/changepassword', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            window.location.href = '/ChangePassword';
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        }).then(function () {
                            window.location.href = '/ChangePassword';
                        });
                    }
                }
                );
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card' style={{ marginTop: '20px' }}>
                        <div className='card-header'>
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Change Password</h4>
                                </div>
                                <hr></hr>
                                <div className='card-body'>
                                    <form action="/" method="POST" onSubmit={changePassword}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Password</label>
                                                    <input type="password" name="password" className="form-control" placeholder="Password" required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Confirm Password</label>
                                                    <input type="password" name="cpassword" className="form-control" placeholder="Confirm Password" required />
                                                </div>
                                            </div>
                                        </div>
                                        <input type="hidden" name="profile_id" defaultValue={profile._id} />
                                        <div className="row">
                                            <div className="col-md-12">
                                                <button type="submit" className="btn btn-primary" style={{ float: "right" }}>Change Password</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
