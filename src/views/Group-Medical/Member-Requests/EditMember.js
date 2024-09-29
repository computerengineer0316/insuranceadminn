import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const EditMember = () => {
    const navigate = useNavigate();
    const [memberDetails, setMemberDetails] = useState({});
    const [updateDetails, setUpdateDetails] = useState({});
    const [updateId, setUpdateId] = useState('');
    const [genderList, setGenderList] = useState([])
    const [maritalStatusList, setMaritalStatus] = useState([])
    const [relationList, setRelationList] = useState([])
    const [regionList, setRegionList] = useState([])
    const [nationalityList, setNationalityData] = useState([])
    const [workLocationList, setWorkLocationList] = useState([])
    const [sponsorTypeList, setSponsorType] = useState([])
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            GetMemberDetails(id);
            setUpdateId(id);
            getGender()
            getMaritalStatus()
            GetRelationList()
            GetRegionList()
            getNationality()
            GetWorkLocationList()
            GetSponsorTypeList()

        }
    }, [])
    const GetMemberDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/GetSingleMemberRequest?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('data>>>>>', data);
                setMemberDetails(data.data[0])
            });
    }
    const HandleChange = (e) => {
        const { name, value } = e.target;
        setUpdateDetails({ ...updateDetails, [name]: value });
    }
    const UpdateMember = () => {

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateDetails)
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/UpdateGroupMedicalMember?id=${updateId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: "Updated Successfully",
                        icon: "success",
                        type: "success",
                        buttons: false
                    })
                    setTimeout(() => {
                        swal.close();
                        navigate(-1)
                    }, 2000);
                } else {
                    swal({
                        text: "Something went wrong",
                        icon: "error",
                        buttons: false
                    })
                    setTimeout(() => {
                        swal.close();
                        navigate(-1)
                    }, 2000);
                }
            });
    }
    const getGender = () => {
        const reqOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/getGender", reqOption)
            .then((response => response.json()))
            .then(data => {
                console.log(data.data, "gender data")
                setGenderList(data.data)
            })
    }
    const getMaritalStatus = () => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/getMaritalStatus", reqOptions)
            .then((response => response.json()))
            .then(data => {
                setMaritalStatus(data.data)
            })
    }
    const GetRelationList = () => {
        const reqOptioins = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/getRelation", reqOptioins)
            .then((response) => response.json())
            .then((data) => {
                setRelationList(data.data)
            })
    }
    const GetRegionList = () => {
        const reqOptioins = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration", reqOptioins)
            .then((val) => val.json())
            .then((data) => {
                setRegionList(data.data)
            })
    }
    const getNationality = () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token") || ""
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/get_nationality_list", requestOptions)
            .then(response => response.json())
            .then((data) => {
                setNationalityData(data.data)
                // console.log("nationalityData>>>>>>>>>>>>>>>>>>>>>>>>", data.data)
            })
    }
    const GetWorkLocationList = () => {
        const reqOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/getWorkLocation", reqOption)
            .then((response) => response.json())
            .then((data) => {
                setWorkLocationList(data.data)
            })
    }
    const GetSponsorTypeList = () => {
        const reqOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/getsponsortype", reqOption)
            .then((response) => response.json())
            .then((data) => {
                setSponsorType(data.data)
            })
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Edit Member Details</h4>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' onClick={() => navigate(-1)} style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>First Name</label>
                                        <input onChange={(e) => HandleChange(e)} name='firstName' defaultValue={memberDetails?.firstName} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Middle Name</label>
                                        <input onChange={(e) => HandleChange(e)} name='middleName' defaultValue={memberDetails?.middleName} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Last Name</label>
                                        <input onChange={(e) => HandleChange(e)} name='lastnName' defaultValue={memberDetails?.lastnName} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Employee Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='employeeNumber' defaultValue={memberDetails?.employeeNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Date Of Birth</label>
                                        <input onChange={(e) => HandleChange(e)} name='dateOfBirth' defaultValue={memberDetails?.dateOfBirth?.slice(0, 10)} type='date' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Gender</label>
                                        <select className='form-control'
                                            onChange={(e) => HandleChange(e)} name='gender'>
                                            <option value={''}>Select Gender</option>
                                            {genderList?.map((item) => (
                                                <option selected={memberDetails.gender == item.name ? true : false} key={item._id} value={item.name}>{item.name}</option>
                                            ))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='gender' defaultValue={memberDetails?.gender} type='text' className='form-control' /> */}
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Marital Status</label>
                                        <select className='form-control' name='maritalStatus' onChange={(e) => HandleChange(e)}>
                                            <option value={''}>Select Marital Status</option>
                                            {
                                                maritalStatusList?.map((item) => (
                                                    <option selected={memberDetails?.maritalStatus == item.name ? true : false} key={item._id} value={item.name}>{item.name}</option>))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='maritalStatus' defaultValue={memberDetails?.maritalStatus} type='text' className='form-control' /> */}
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Relation</label>
                                        <select className='form-control' name='relation' onChange={(e) => HandleChange(e)}>
                                            <option value={''}>Select Relation</option>
                                            {relationList?.map((item) => (<option selected={memberDetails?.relation == item.name ? true : false} key={item._id} value={item.name}>{item.name}</option>))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='relation' defaultValue={memberDetails?.relation} type='text' className='form-control' /> */}
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Category</label>
                                        <input onChange={(e) => HandleChange(e)} name='category' defaultValue={memberDetails?.category} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Region</label>
                                        <select className='form-control' name='regino' defaultValue={memberDetails?.regino} onChange={(e) => HandleChange(e)}>
                                            <option value={''}>Select Region</option>
                                            {
                                                regionList?.map((item) => (
                                                    <option selected={memberDetails.regino == item.area_of_registration_name ? true : false} key={item._id} value={item.area_of_registration_name}>{item.area_of_registration_name}</option>))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='regino' defaultValue={memberDetails?.regino} type='text' className='form-control' /> */}
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>LSB</label>
                                        <input onChange={(e) => HandleChange(e)} name='LSB' defaultValue={memberDetails?.LSB} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Nationality</label>
                                        <select className='form-control' name='nationality' onChange={(e) => HandleChange(e)}>
                                            <option value={''}>Select Nationality</option>
                                            {
                                                nationalityList?.map((item) => (
                                                    <option selected={memberDetails?.nationality == item.nationality_name ? true : false} key={item._id} value={item.nationality_name}>{item.nationality_name}</option>))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='nationality' defaultValue={memberDetails?.nationality} type='text' className='form-control' /> */}
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Passport Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='passportNumber' defaultValue={memberDetails?.passportNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Eid Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='EidNumber' defaultValue={memberDetails?.EidNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Uid Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='UidNumber' defaultValue={memberDetails?.UidNumber} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Visa Issued Location</label>
                                        <input onChange={(e) => HandleChange(e)} name='visaIssuedLocation' defaultValue={memberDetails?.visaIssuedLocation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Actual Salary Band</label>
                                        <input onChange={(e) => HandleChange(e)} name='firstName' defaultValue={memberDetails?.actualSalryBand} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Person Commission</label>
                                        <input onChange={(e) => HandleChange(e)} name='personCommission' defaultValue={memberDetails?.personCommission} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>

                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Residential Location</label>
                                        <select className='form-control' onChange={(e) => HandleChange(e)}>
                                            <option value={''}>Select Residential Location</option>
                                            {workLocationList?.map((item) => (
                                                <option selected={memberDetails?.residentialLocation == item.worklocation ? true : false} key={item._id} value={item.worklocation}>{item.worklocation}</option>
                                            ))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='residentialLocation' defaultValue={memberDetails?.residentialLocation} type='text' className='form-control' /> */}
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Work Location</label>
                                        <select className='form-control' onChange={(e) => HandleChange(e)}>
                                            <option value={''}>Select Work Location</option>
                                            {workLocationList?.map((item) => (
                                                <option selected={memberDetails?.residentialLocation == item.worklocation ? true : false} key={item._id} value={item.worklocation}>{item.worklocation}</option>
                                            ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Mobile Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='phoneno' defaultValue={memberDetails?.phoneno} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Email</label>
                                        <input onChange={(e) => HandleChange(e)} name='email' defaultValue={memberDetails?.email} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Photo File Name</label>
                                        <input onChange={(e) => HandleChange(e)} name='photoFileName' defaultValue={memberDetails?.photoFileName} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Type</label>
                                        <select className='form-control' onChange={(e) => HandleChange(e)} name='sponsorType'>
                                            <option value={''}>Select Sponsor Type</option>
                                            {sponsorTypeList?.map((item) => (
                                                <option selected={memberDetails?.sponsorType == item.sponsortype} key={item._id} value={item.sponsortype}>{item.sponsortype}</option>
                                            ))
                                            }
                                        </select>
                                        {/* <input onChange={(e) => HandleChange(e)} name='sponsorType' defaultValue={memberDetails?.sponsorType} type='text' className='form-control' /> */}
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Id</label>
                                        <input onChange={(e) => HandleChange(e)} name='sponsorId' defaultValue={memberDetails?.sponsorId} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Contact Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='sponsorContactNumber' defaultValue={memberDetails?.sponsorContactNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Contact Email</label>
                                        <input onChange={(e) => HandleChange(e)} name='sponsorContactEmail' defaultValue={memberDetails?.sponsorContactEmail} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Occupation</label>
                                        <input onChange={(e) => HandleChange(e)} name='occupation' defaultValue={memberDetails?.occupation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Additional Effective Date</label>
                                        <input onChange={(e) => HandleChange(e)} name='AdditionEffectiveDate' defaultValue={memberDetails?.AdditionEffectiveDate?.slice(0, 10)} type='date' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Visa File FNumber</label>
                                        <input onChange={(e) => HandleChange(e)} name='visaFileNumber' defaultValue={memberDetails?.visaFileNumber} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Birth Certificate Number</label>
                                        <input onChange={(e) => HandleChange(e)} name='birthCertificateNumber' defaultValue={memberDetails?.birthCertificateNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                            </div>
                            {/* <div className='row'>
                                
                            </div> */}
                            <button className='btn btn-primary' onClick={() => UpdateMember()}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditMember
