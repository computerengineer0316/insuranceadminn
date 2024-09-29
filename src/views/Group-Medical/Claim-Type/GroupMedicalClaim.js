import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const GroupMedicalClaim = () => {
    const navigate = useNavigate()
    const [claimStatusData, setClaimStatusData] = useState([])
    const [formData, setFormData] = useState({})
    const [claimid, setClaimId] = useState('')
    const [no, setNumber] = useState('')
    useEffect(() => {
        const url = window.location.href;
        const spliturl = url.split("=")
        const id = spliturl[1]
        setClaimId(id)
        getClaimStatus()
    }, [])
    const getClaimStatus = () => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getActiveClaimStatus', reqOptions)
            .then(response => response.json())
            .then(data => {
                // console.log(data.data, "claim status data")
                setClaimStatusData(data.data)
            })
    }
    const HandleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const UpdateClaim = () => {
        const reqOption = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGroupMedicalClaim?id=${claimid}`, reqOption)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        icon: 'success',
                        text: data.message,
                        type: "success"
                    })
                    navigate(-1)
                } else {
                    swal({
                        incon: "error",
                        text: data.message,
                        type: "error"
                    })
                    navigate(-1)
                }
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
                                    <h4>Claim</h4>
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
                                        <strong><label htmlFor='claim_status'>Claim Status</label></strong>
                                        <select
                                            className='form-control'
                                            name='claim_status'
                                            onChange={(e) => HandleChange(e)}
                                        >
                                            <option value='' hidden>Select Claim Status</option>
                                            {
                                                claimStatusData?.map((item, index) => (
                                                    <option key={index} value={item.status_name}>{item.status_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <strong><label>Remark</label></strong>
                                        <input type='text' placeholder='Enter Remark' onChange={(e) => HandleChange(e)} name='remark' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <strong><label>Paid Amount</label></strong>
                                        <input type='text' placeholder='Enter Paid Amount' className='form-control' onChange={(e) => HandleChange(e)} name='paid_amount' />
                                    </div>
                                </div>
                            </div>
                            {/* <div className='row'> */}
                            <button onClick={() => UpdateClaim()} className='btn btn-primary'>Submit</button>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default GroupMedicalClaim
