import { element } from 'prop-types';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const EditClaimrequestMemberdetails = () => {
    const navigate = useNavigate();
    const [memberDetails, setMemberDetails] = useState({});
    const [updateDetails, setUpdateDetails] = useState({});
    const [updateId, setUpdateId] = useState('');
    const [principleList, setPrincipleList] = useState([])
    const [memberList, setMemberlist] = useState([])
    const [relationList, setRelationList] = useState([])
    const [principleName, setPrincipleName] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [principleId, setPrincipleId] = useState('')
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
        }
    }, [])
    useEffect(() => {
        GetPrincipleNames()
    }, [principleName])

    const GetMemberDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalClaimById?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setMemberDetails(data.data[0]);
                setPrincipleName(data.data[0]?.member_data?.firstName)

            });
    }
    const GetPrincipleNames = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllPrincepleOfHr`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const principleData = data.data
                const foundMember = principleData?.find(elmnt => elmnt.firstName == principleName)
                getMemberNames(foundMember?.employeeNumber)
                if (foundMember) {
                    console.log(foundMember, "><><found Member")
                }
                setPrincipleList(data.data);
            });
    }
    const HandleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'principle_name') {
            const splitdt = value.split("&-$")
            getMemberNames(splitdt[0])
            setEmployeeId(splitdt[0])
            setPrincipleId(splitdt[1])
        }
        if (name == 'member_name') {
            getRelations(value)
        }
    }
    const getRelations = (memberId) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getRelationOfUser?id=${memberId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setRelationList(data.data)
            })
    }
    const getMemberNames = (empId) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllmemberOfHr?employeeId=${empId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setMemberlist(data.data)
            })

    }
    const HandleClaimFormSubmit = (e) => {
        e.preventDefault()
        const dt = new FormData(e.target)
        // const principle_name = dt.get('principle_name')
        const member_name = dt.get('member_name')
        const relation = dt.get('relation')
        const employeeId = dt.get('employeeId')
        const claim_description = dt.get('claim_description')
        const claim_amount = dt.get('claim_amount')
        const dateOfTreatment = dt.get('dateOfTreatment')
        if (claim_description == '' || claim_amount == '' || dateOfTreatment == '') {
            swal({
                type: 'warning',
                icon: 'warning',
                text: 'Please fill all the fields'
            })
            return false;
        }
        let obj = {
            principleName: principleId,
            member_name: member_name,
            relation: relation,
            employeeId: employeeId,
            claim_description: claim_description,
            claim_amount: claim_amount,
            dateOfTreatment: dateOfTreatment
        }
        // return false;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGroupMedicalClaimByHr?id=${updateId}`, requestOptions)
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

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Edit Claim Request Member Details</h4>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' onClick={() => navigate(-1)} style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <form method='POST' onSubmit={HandleClaimFormSubmit}>
                                <div className='row'>
                                    {/* <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Principle Name</label>
                                        <select className='form-control'
                                            name='principle_name'
                                            onChange={(e) => HandleChange(e)} 
                                        >
                                            <option>Select Principal Name</option>
                                            {
                                                principleList?.map((item, index) => (
                                                    <option key={index} selected={principleName == item.firstName ? true : false} value={item.employeeNumber+"&-$"+item._id}>{item.firstName}</option>))
                                            }
                                        </select>
                                    </div>
                                </div> */}
                                    {/* <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Member Name</label>
                                            <select className='form-control' name='member_name'
                                                defaultValue={''}
                                            onChange={(e)=>HandleChange(e)}
                                        >
                                            <option>Select Member Name</option>
                                            {
                                                memberList?.map((item, index) => (
                                                    <option key={index} value={item._id}>{item.firstName}</option>
))
                                            }
                                        </select>
                                    </div>
                                </div> */}
                                    {/* <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Relation</label>
                                        <select name='relation' defaultValue='' className='form-control'>
                                            <option>Select Relation</option>
                                            {
                                                relationList?.map((item, index) => (
                                                    <option key={index} value={item._id}>{item.relation}</option>
))
                                            }
                                        </select>
                                    </div>
                                </div> */}
                                </div>
                                <div className='row'>
                                    {/* <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Employee Id</label>
                                        <input onChange={(e) => HandleChange(e)} name='employeeId' defaultValue={employeeId} type='text' className='form-control' />
                                    </div>
                                </div> */}
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor=''>Date Of Treatement</label>
                                            <input name='dateOfTreatment' defaultValue={memberDetails?.dateOfTreatment?.slice(0, 10)} type='date' className='form-control' />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor=''>Brief Description of Claim</label>
                                            <input name='claim_description' defaultValue={memberDetails?.claimDscription} type='text' className='form-control' />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor=''>Claim Amount (AED)</label>
                                            <input name='claim_amount' defaultValue={memberDetails?.claimAmountFromHr} type='text' className='form-control' />
                                        </div>
                                    </div>
                                </div>
                                <button className='btn btn-primary' >Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditClaimrequestMemberdetails
