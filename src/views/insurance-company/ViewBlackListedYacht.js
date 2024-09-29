import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import { Modal, Button } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

const ViewBlackListedYacht = () => {

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

            getlistMakeMotor();



        }
    }, []);


    useEffect(() => {
        get_company_details(company_id);

    }, [make_motor_filter_id, searchvalue]);



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
                    console.log(result.blackListYatch, ">>>>>>>>>>>>>>>>>>>>>>>>blackListVehicle")
                    setListBlackListedVehicle(result.blackListYatch)
                    getlistModelMotordetials(result.blackListYatch, page, perPage);

                }
                );

        } catch (error) {
            console.log(error)
        }
    }
    const getlistMakeMotor = () => {
        const requestOptions = {
            method: 'Get',
            // body: JSON.stringify({
            //     make: "Make"
            // }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getYachtMake', requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                console.log(list, "list")
                setMakeMotor(list);

            });
    }



    const handleSubmit = (e) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(listBlackListedVehicle),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/addBlacklistYatch?companyId=${company_id}`, requestOptions)
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
                        // getlistModelMotordetials(MakeId, page, perPage);
                        setInputData([])

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
        get_company_details(company_id);

        getlistModelMotordetials(selectedPage + 1, perPage);
    };
    const handleCheckboxChange = (e, make) => {

        const stateValue = [...formData]
        const inputValue = [...inputData]
        const blyv = [...listBlackListedVehicle]

        if (e.target.checked === true) {
            blyv.push(make._id)
            // make['checked'] = 'checked';
            // stateValue.push(make)
            // inputValue.push({ modelId: make._id })
            setListBlackListedVehicle(blyv)
        }

        else if (e.target.checked === false) {

            const indx = stateValue.indexOf(make)
            stateValue.splice(indx, 1)
            let blyvindex = blyv.indexOf(make._id)
            blyv.splice(blyvindex, 1)
            setListBlackListedVehicle(blyv)
            // let obj = inputValue.find(item => item.modelId === make._id);
            // if (obj) {
            //     const indx1 = inputValue.indexOf(obj)
            //     inputValue.splice(indx1, 1)
            // } else {
            //     inputValue.push({ modelId: make._id })
            // }
        }
        setFormData(stateValue)
        setInputData(inputValue)
        console.log(inputValue, "inputData")
    };

    const getlistModelMotordetials = (MakeId, page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ MakeId: make_motor_filter_id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_Yacht_Model?page=${page}&limit=${perPage}&name=${searchvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                // const listArr = []

                // for (let i = 0; i < list.length; i++) {
                //     for (let j = 0; j < MakeId.length; j++) {
                //         if (list[i]._id == MakeId[j]) {
                //             list[i]['checked'] = 'checked';
                //         }
                //     }
                //     listArr.push(list[i])
                // }
                setData(list);
                // setInputData(inputArr)
                // console.log(list, "list")

            });
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


    console.log(make_motor, "make_motor")

    console.log(make_motor_filter_id, "make_motor_filter_id")



    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-4">
                                        <h4 className="card-title">Black Listed Yacht</h4>
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
                                            defaultValue={make_motor_filter_id}
                                            onChange={(e) => setMakeMotorFilterId(e.target.value)}
                                        >
                                            <option value="">-- All --</option>
                                            {make_motor?.map((item, index) => {
                                                return (
                                                    <option key={index} value={item._id}>{item.name}</option>
                                                )
                                            })}
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
                                                <th>Make Yacht</th>
                                                <th>Model Yacht</th>
                                                <th>Body Type</th>
                                                <th>Engine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data?.map((item, index) => {
                                                    return (
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
                                                            <td>{item.start_year}</td>
                                                            <td>{item?.yachtmakes[0]?.name}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.Yacht_body_type[0]?.yacht_body_type}</td>
                                                            <td>{item.engine}</td>

                                                        </tr>
                                                    )
                                                })
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

export default ViewBlackListedYacht