import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import { Modal, Button } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

const ViewBlackListedVehicle = () => {
    const navigate = useNavigate();
    const [listBlackListedVehicle, setListBlackListedVehicle] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [company_id, setCompanyId] = useState('');
    const [make_motor, setMakeMotor] = useState([]);
    const [modelmotor, setModelMotor] = useState([]);
    const [motormodel, setMotorModel] = useState([]);
    const [modelvariant, setModelVariant] = useState([]);
    const [company_name, setCompanyName] = useState('');
    const [data, setData] = useState([]);
    const [searchvalue, setSearchvalue] = useState('');
    const [model_motor_filter_id, setModelMotorFilterId] = useState('');
    const [make_motor_filter_id, setMakeMotorFilterId] = useState('');
    const [formData, setFormData] = useState([]);
    const [inputData, setInputData] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setCompanyId(id);
            get_company_details(id);
            // getlistModelMotordetials(page, perPage);
            getlistMakeMotor();
            // getlistBlackListedVehicle(id, page, perPage);


        }
    }, []);


    useEffect(() => {
        getmodelmotor();
        get_company_details(company_id);

        // getlistModelMotordetials(page, perPage);

    }, [make_motor_filter_id, model_motor_filter_id, searchvalue]);

    // useEffect(() => {
    //     getmodelvariant();
    // }, [make_motor,motormodel]);


    const get_company_details = (id) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompanyDetailsbyid/${id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const result = data.data;
                    setCompanyName(result.company_name);
                    // console.log(result.blackListVehicle,">>>>>>>>>>>>>>>>>>>>>>>>blackListVehicle")
                    setListBlackListedVehicle(result.blackListVehicle)
                    getlistModelMotordetials(result.blackListVehicle, page, perPage);

                }
                );

        } catch (error) {
            console.log(error)
        }
    }
    const getlistMakeMotor = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                make: "Make"
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicle', requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                setMakeMotor(list);

            });
    }

    const getmodelmotor = () => {
        return (e) => {


            const make_motor = e.target.value;
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({
                    makeId: [make_motor]
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicle`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data, "data.data")
                    const motormodeldt = data.data.map((val) => ({ label: val.motor_model_name, value: val._id }));
                    console.log(motormodeldt, "motormodeldt")
                    setModelMotor(motormodeldt);
                    // getmodelvariant(motormodeldt.map((val) => (val.value))) 
                    const model_variant = motormodeldt.map((val) => (val.value));

                    const requestOptions = {
                        method: 'POST',
                        body: JSON.stringify({
                            modelId: model_variant
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    };
                    fetch(`https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicle`, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.data, "data.data")
                            const motormodeldt = data.data.map((val) => ({ label: val.motor_model_detail_name, value: val._id }));
                            console.log(motormodeldt, "motormodeldt")
                            setModelVariant(motormodeldt);
                        }
                        );


                });
        }
    }
    // console.log(modelmotor,"modelmotor")
    // console.log(motormodel,"motormodel")

    // const getmotormodel = () => 
    // {
    //     return (e) => {
    //         const modelmotor = e.target.value;
    //         const requestOptions = {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         };
    //         fetch(`https://insuranceapi-3o5t.onrender.com/api/motormodel/${modelmotor}`, requestOptions)
    //             .then(response => response.json())
    //             .then(data => {
    //                 const motormodeldt = data.data;
    //                 console.log(motormodeldt,">>>>>>>>>>>>>>>>>>>>motor models")
    //                 const motormodel_len = motormodeldt.length;
    //                 const motormodel_list = [];
    //                 for(let i = 0; i < motormodel_len; i++)
    //                 {
    //                     const motormodel_obj = {label: motormodeldt[i].motor_model_detail_name, value: motormodeldt[i]._id};
    //                     motormodel_list.push(motormodel_obj);
    //                 }
    //                 setMotorModel(motormodel_list);
    //             });
    //     }
    // }

    // const getlistBlackListedVehicle = (id, page, perPage) => {
    //     console.log(id, page, perPage,"id, page, perPage")
    //     // setListBlackListedVehicle([]);
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     };
    //     fetch(`https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicles/${id}/${page}/${perPage}`, requestOptions)
    //         .then(response => response.json())
    //         .then(data => {
    //             const total = data.total;
    //             const slice = total / perPage;
    //             const pages = Math.ceil(slice);
    //             setPageCount(pages);
    //             const list = data.data;
    //             console.log(list,"this is list ")
    //             // setListBlackListedVehicle(list);
    //         });
    // }

    const handleSubmit = (e) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(listBlackListedVehicle),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/addCompanyBlackList?companyId=${company_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    setShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        // getlistBlackListedVehicle(company_id, page, perPage);
                    });
                }
                else {
                    setShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        // getlistBlackListedVehicle(company_id, page, perPage);
                    });
                }
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        // get_company_details(company_id);

        getlistModelMotordetials("", selectedPage + 1, perPage);
    };
    const handleCheckboxChange = (e, make) => {
        const stateValue = [...formData]
        // const inputValue = [...inputData]
        const blv = [...listBlackListedVehicle]

        if (e.target.checked === true) {
            blv.push(make._id)
            // make['checked'] = 'checked';
            // stateValue.push(make)
            // inputValue.push({ variantId: make._id })
            setListBlackListedVehicle(blv)
        } else if (e.target.checked === false) {

            const indx = stateValue.indexOf(make)
            stateValue.splice(indx, 1)
            let blvindx = blv.indexOf(make._id)
            blv.splice(blvindx, 1)
            setListBlackListedVehicle(blv)
            // let obj = inputValue.find(item => item.variantId === make._id);
            // if (obj) {
            //     const indx1 = inputValue.indexOf(obj)
            //     inputValue.splice(indx1, 1)
            // } else {
            //     inputValue.push({ variantId: make._id })
            // }
        }
        // setFormData(stateValue)
        // setInputData(inputValue)
        // console.log(inputValue, "inputData")
    };

    const getlistModelMotordetials = (modelid, page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ makeId: make_motor_filter_id, modelId: model_motor_filter_id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Motor_model_details?page=${page}&limit=${perPage}&name=${searchvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                // const listArr = []
                // const inputArr =[]
                // for (let i = 0; i < list.length; i++) {
                //     for (let j = 0; j < modelid.length; j++) {
                //         if (list[i]._id == modelid[j]) {
                //             list[i]['checked'] = 'checked';
                //             //    inputArr.push({variantId:list[i]._id})
                //         }
                //     }
                //     listArr.push(list[i])
                // }
                setData(list);
                // setInputData(inputArr)
                // console.log(listArr, "list")

            });
    }

    const getmodelmotorbyid = (e, id) => {
        try {
            setMakeMotorFilterId(e.target.value)
            if (id === '') {
                setModelMotorFilterId('');
                return;
            }
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const modelmotordt = data.data;
                    setModelMotor(modelmotordt);
                    console.log(modelmotordt, ">>>>>>list model motor")
                });

        }
        catch (err) {
            console.log(err)
        }
    }
    const startFrom = (page - 1) * perPage;

    const spanStyle = {
        border: '2px solid gray',
        borderRadius: '8px', // Adjust the value as needed
        backgroundColor: 'gray', // Replace with the desired background color
        color: '#FFFFFF', // Replace with the desired text color
        fontSize: '20px', // Adjust the value as needed
        padding: '4px',
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-4">
                                        <h4 className="card-title">Black Listed Vehicle</h4>
                                        <span style={spanStyle}>{company_name}</span>
                                    </div>
                                    <div className="col-md-8" style={{ textAlign: "right" }}>
                                        <a href="/insurance-company" className="btn btn-primary">Back</a>&nbsp;&nbsp;
                                    </div>
                                </div>
                            </div>
                            <div className="card-header">
                                <div className='row'>
                                    <div className='col-lg-3'>
                                        <label><strong>Select Make</strong></label><br />
                                        <select className='form-control'
                                            value={make_motor_filter_id}
                                            onChange={(e) => getmodelmotorbyid(e, e.target.value)}
                                        >
                                            <option value="">-- All --</option>
                                            {make_motor.map((item, index) => {
                                                return (
                                                    <option key={index} value={item._id}>{item.make_motor_name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='col-lg-3'>
                                        <label><strong>Select Model</strong></label><br />
                                        <select
                                            value={model_motor_filter_id}
                                            className='form-control'
                                            onChange={(e) => setModelMotorFilterId(e.target.value)}
                                        >
                                            <option value="">-- All --</option>

                                            {make_motor_filter_id !== undefined && make_motor_filter_id.length > 0 &&
                                                modelmotor.map((item) => (
                                                    <option key={item._id} value={item._id}>{item.motor_model_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className='col-lg-3'>
                                        <label><strong>Search</strong></label><br />
                                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />
                                    </div>
                                    <div className="col-md-3" style={{ textAlign: "right" }}>
                                        <button className='btn btn-primary' onClick={() => handleSubmit()}>Submit</button>
                                    </div>
                                </div>


                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Start Year</th>
                                                <th>Make Motor</th>
                                                <th>Model Motor</th>
                                                <th>Motor Model Details</th>
                                                <th>Body Type</th>
                                                <th>Cylinder</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data?.map((item, index) => (
                                                    // return (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <div className="checkboxs">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item._id}
                                                                    defaultChecked={listBlackListedVehicle?.includes(item._id)}
                                                                    onChange={(e) => handleCheckboxChange(e, item)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>{item.motor_model_detail_start_year}</td>
                                                        <td>{item.makeMotor?.make_motor_name}</td>
                                                        <td>{item.motor_model[0]?.motor_model_name}</td>
                                                        <td>{item.motor_model_detail_name}</td>
                                                        <td>{item.body_type?.body_type_name}</td>
                                                        <td>{item.motor_model_detail_cylinder}</td>

                                                    </tr>
                                                ))
                                                // )
                                            }
                                        </tbody>
                                    </table>
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination justify-content-end"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Black Listed Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-body">
                                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group mb-3">
                                                            <label><strong>Make Motor</strong></label>
                                                            <select 
                                                            className="form-control" 
                                                            name="make_motor" 
                                                            onChange={getmodelmotor()}>
                                                                <option value="" hidden>Select Make Motor</option>
                                                                {
                                                                    make_motor.map((item, index) => {
                                                                        return (
                                                                            <option  key={index} value={item._id}>{item.make_motor_name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group mb-3">
                                                            <label><strong>Model Motor</strong></label>
                                                            <Multiselect
                                                                    options={modelmotor}
                                                                    selectedValues={modelmotor}
                                                                    displayValue="label"
                                                                    onSelect={(event) => handleChange1(event, 'model')}
                                                                    onRemove={(event) => handleChange1(event, 'model')}
                                                                    placeholder="Select Model"
                                                                    showCheckbox={true}
                                                                    closeOnSelect={false}
                                                                    required
                                                                />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group mb-3">
                                                            <label><strong>Model Motor Details</strong></label>
                                                               
                                                            <Multiselect
                                                                    options={modelvariant}
                                                                    selectedValues={modelvariant}
                                                                    displayValue="label"
                                                                    onSelect={setModelVariant}
                                                                    onRemove={setModelVariant}
                                                                    placeholder="Select Variant"
                                                                    showCheckbox={true}
                                                                    closeOnSelect={false}
                                                                    required
                                                                />



                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn btn-primary mt-2 submit_all" style={{float:"right",}}>Save</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal> */}

        </>
    )
}

export default ViewBlackListedVehicle
