import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const ViewProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [profileImage, setProfileImage] = useState([]);

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

    const updateProfile = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name');
        const email = data.get('email');
        const mobile = data.get('mobile');
        const profileid = data.get('profile_id');

        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('mobile', mobile);
        fd.append('profile_image', profileImage);
        fd.append('profile_id', profileid);

        const requestOptions = {
            method: "POST",
            body: fd,
        };

        fetch("https://insuranceapi-3o5t.onrender.com/api/updateprofile", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        localStorage.setItem('user', JSON.stringify(data.data));
                        window.location.href = '/ViewProfile';
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        window.location.href = '/ViewProfile';
                    });
                }
            });
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card' style={{ marginTop: '20px' }}>
                        <div className='card-header'>
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Profile</h4>
                                </div>
                                <hr></hr>
                                <div className='card-body'>
                                    <form action="/" method="POST" onSubmit={updateProfile}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Name</label>
                                                    <input type="text" name="name" className="form-control" placeholder="Name" defaultValue={profile.name} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Email</label>
                                                    <input type="email" name="email" className="form-control" placeholder="Email" defaultValue={profile.email} required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Mobile</label>
                                                    <input type="text" name="mobile" className="form-control" placeholder="Mobile" defaultValue={profile.mobile} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Profile Image</label>
                                                    <input type="file" className="form-control" placeholder="Profile Image" accept=".png, .gif, .jpg, .jpeg" onChange={(e) => setProfileImage(e.target.files[0])} />
                                                </div>
                                            </div>
                                        </div>
                                        <input type="hidden" name="profile_id" defaultValue={profile._id} />
                                        <div className="row">
                                            <div className="col-md-12">
                                                <button type="submit" className="btn btn-primary" style={{ float: "right" }}>Update</button>
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

export default ViewProfile
