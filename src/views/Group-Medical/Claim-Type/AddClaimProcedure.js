import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert'
const AddClaimProcedure = () => {
    const navigate = useNavigate()
    const [descriptions, AddDescription] = useState([{
        description: '',
        link: '',
        heading: '',
        company_name: ''
    }])
    const [companyList, setCompanyList] = useState([]);
    useEffect(() => {
        company_list()
    })
    const company_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/company_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCompanyList(data.data);
            });
    }
    const Addrow = () => {
        console.log("rows>>>", descriptions)
        const newarr = {
            description: '',
            link: '',
            heading: '',
            company_name: ''
        }
        AddDescription([...descriptions, newarr])
    }

    const deleteTableRows = (index) => {
        const rows = [...descriptions]
        rows.splice(index, 1)
        AddDescription(rows)
    }
    const HandleChange = (e, index) => {
        const { name, value } = e.target
        const rowsInput = [...descriptions]
        rowsInput[index][name] = value
        AddDescription(rowsInput)
    }
    const AddProcedure = () => {
        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(descriptions)
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/addClaimProcedure`, reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    swal({
                        type: 'success',
                        text: data.message,
                        icon: 'success',
                        button: false
                    })
                    setTimeout(() => {
                        swal.close()
                        navigate('/ViewClaimProcedure')
                    }, 1000);
                } else {
                    swal({
                        type: 'error',
                        text: data.message,
                        icon: 'error',
                        button: false
                    })
                    setTimeout(() => {
                        swal.close()
                        navigate('/ViewClaimProcedure')
                    }, 1000);
                }
            });
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="card-title">Add Claim Procedure</h4>
                                </div>
                                <div className='col-md-8'>
                                    <button onClick={() => navigate("/ViewClaimProcedure")} style={{ float: 'right' }} className='btn btn-primary'>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            {descriptions?.map((item, index) => (
                                <div key={index} className='container col-lg-12 my-5'>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className='form-group'>
                                                <label><strong>Insurance Company</strong></label>
                                                <select className='form-control'
                                                    name='company_name'
                                                    onChange={(e) => HandleChange(e, index)}
                                                >
                                                    <option>Select Company</option>
                                                    {companyList?.map((item, index) => (
                                                        <option key={index} value={item._id}>{item.company_name}</option>
                                                    ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='form-group'>
                                                <label><strong>Heading</strong></label>
                                                <input placeholder='Enter Heading' onChange={(e) => HandleChange(e, index)} type='text' name='heading' className='form-control' />
                                            </div>
                                        </div>

                                        <div className='col-md-4'>
                                            <div className='form-group'>
                                                <label><strong>Link</strong></label>
                                                <input placeholder='Enter Link' onChange={(e) => HandleChange(e, index)} type='text' name='link' className='form-control' />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md-11'>
                                            <label><strong>Description</strong></label>
                                            <textarea onChange={(e) => HandleChange(e, index)} rows={4} type='text' className='form-control' name='description' />
                                        </div>
                                        <div className='col-md-1 d-flex justify-content-center align-items-center'>
                                            <button onClick={() => deleteTableRows(index)} className='btn btn-danger'>X</button>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <button className='btn btn-success my-2' onClick={() => Addrow()} style={{ float: 'left' }}>+</button>
                    <button disabled={!descriptions.length ? true : false} className='btn btn-primary my-2' onClick={() => AddProcedure()} style={{ float: 'right' }}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default AddClaimProcedure
