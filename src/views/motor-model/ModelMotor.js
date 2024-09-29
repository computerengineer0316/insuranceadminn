import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import filePath from '../../webroot/sample-files/motor-model.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CProgress } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const ModelMotor = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [make_motor, setMakeMotor] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [model_motor_id, setModelMotorId] = useState('');
    const [model_motor_name, setModelMotorName] = useState('');
    const [model_motor_make, setModelMotorMake] = useState('');
    const [model_motor_status, setModelMotorStatus] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [motorpermission, setMotorPermission] = useState([]);
    const [searchvalue, setSearchvalue] = useState('');
    const [nodata, setNodata] = useState('');
    const [statusvalue, setStatusvalue] = useState(2);
    const [editlocation, setEditLocation] = useState([]);
    const [qatarvisible, setQatarVisible] = useState(false);
    const [qatarexcelfile, setQatarExcelfile] = useState("");
    const [loading, setLoading] = useState(false);





    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistModelMotor(page, perPage);
            getlistMakeMotor();
            locationList();
            exportlistdata();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
        }
    }, [])

    useEffect(() => {
        getlistModelMotor(page, perPage);
    }, [searchvalue, statusvalue])

    const getlistModelMotor = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_model_motor?page=${page}&limit=${perPage}&name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                setData(list)
            });
    }

    const getlistMakeMotor = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getlistMakeMotor', requestOptions)
            .then(response => response.json())
            .then(data => {
                setMakeMotor(data.data);
            });
    }



    const locationList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
                // handleChange(location_list);
            });
    }
    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_model_motor', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        const updatedData = exportlist.map((item, index) => {
            return {

                'motor_model_name': item.motor_model_name,
                'make_motor_model': item.make_motor["make_motor_name"],
                'motor_model_location': item.motor_model_location.map((item) => item.location_name).join(", "),
            }
        })
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Motor-Model" + ".xlsx")
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistModelMotor(selectedPage + 1, perPage);
    };

    const deleteModelMotor = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ motor_model_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_model_motor_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false
                    })

                    getlistModelMotor(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");

                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false
                    })
                    getlistModelMotor(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
            });
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_model_motor_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        if (result.success === true) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "failed");
        }
        getlistModelMotor(page, perPage)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const model_motor_name = data.get('model_motor_name');
        const make_motor = data.get('make_motor');
        const model_motor_location = selectedOption;
        const model_motor_location_len = model_motor_location.length;
        const model_motor_location_str = [];
        for (let i = 0; i < model_motor_location_len; i++) {
            model_motor_location_str.push(model_motor_location[i]._id);
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model_motor_name: model_motor_name,
                make_motor: make_motor,
                model_motor_location: model_motor_location_str.toString()
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addModelMotor', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    setShowModal(false);
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    })
                    getlistModelMotor(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");


                }
                else {
                    setShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false
                    })
                    getlistModelMotor(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
            });
    }

    const handleChange = (selectedOption) => {
        setEditLocation(selectedOption);
    };
    const collectQatarExceldata = async (e) => {
        setQatarVisible(false)
        setLoading(true)

        e.preventDefault()
        const fd = new FormData()
        fd.append('file', qatarexcelfile)

        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/addKatarMotorModelsData ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        while (!result) {

        }
        setLoading(false)

        if (result.status === 200) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "danger");
        }
        getlistMakeMotor(page, perPage)
    }

    const getModelMotor = (id) => {
        setModelMotorId(id);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getModelMotorDetails/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {

                setModelMotorName(data.data[0].motor_model_name);
                setModelMotorMake(data.data[0].motor_model_make_id);
                const locationid = data.data[0].motor_model_location
                const location_id = locationid.map((data) => ({ label: data.location_name, value: data._id }));
                setSelectedOption(location_id)
                handleChange(location_id);
                setVisibleedit(true);
            });
    }

    const updateSubmit = (e) => {
        try {
            e.preventDefault();
            const data = new FormData(e.target);
            const model_motor_name = data.get('model_motor_name');
            const make_motor = data.get('make_motor');
            const location = editlocation;
            const location_id = location.map((data) => data.value);

            console.log(editlocation)
            // return false;

            if (location_id.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Please select location",
                    icon: "warning",
                    button: false
                })
                return false;
            }

            // console.log({
            //     model_motor_name: model_motor_name,
            //     make_motor: make_motor,
            //     model_motor_location: location_id,
            //     model_motor_id: model_motor_id
            // })

            // return false;

            else {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model_motor_name: model_motor_name,
                        make_motor: make_motor,
                        model_motor_location: location_id,
                        model_motor_id: model_motor_id
                    })
                };
                fetch('https://insuranceapi-3o5t.onrender.com/api/updateModelMotor', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 200) {
                            setVisibleedit(false);
                            swal({
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false
                            })

                            getlistModelMotor(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, "1000");

                        }
                        else {
                            setVisibleedit(false);
                            swal({
                                text: data.message,
                                type: "error",
                                icon: "error",
                                button: false
                            })
                            getlistModelMotor(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, "1000");
                        }
                    });
            }
        } catch (error) {
            console.log(error);
        }
    }
    const AddModelMotor = () => {
        navigate('/addModelMotor')
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=model`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistModelMotor(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getlistModelMotor(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const startFrom = (page - 1) * perPage;

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Model Motor</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {motorpermission.model_motor?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddModelMotor()}>Add Model Motor</button>
                                            : ''}
                                        {motorpermission.model_motor?.includes('create') ?
                                            <button className='btn btn-dark  btn-icon-text m-r-10' style={{ backgroundColor: "green", marginRight: '15px', float: "right" }} onClick={() => setQatarVisible(true)}>Upload Qatar Model</button>
                                            : ' '}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="card-body">
                            <div className="card-header" style={{textAlign:'right'}}>
                         
                            </div> */}


                            <div className="card-body">
                                <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                                    <div className='col-lg-3'>
                                        <label><strong>Search</strong></label><br />
                                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />

                                    </div>
                                    <div className='col-lg-3'>
                                        <label><strong>Status</strong></label><br />
                                        <select className='form-control'
                                            value={statusvalue}
                                            onChange={(e) => setStatusvalue(e.target.value)}
                                        >
                                            <option value={2}>-- All --</option>
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>

                                    <div className="col-lg-6" style={{ textAlign: 'right' }}>
                                        {motorpermission.model_motor?.includes('download') ?
                                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                            : ''}
                                        {motorpermission.model_motor?.includes('upload') ?
                                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                            : ''}
                                        {motorpermission.model_motor?.includes('export') ?
                                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                            : ''}
                                    </div>
                                </div>
                                {loading && (
                                    <div className="overlay">
                                        <div className="loader-container">
                                            <CProgress color="info" variant="striped" animated value={100} />
                                            <div>Uploading, please wait...</div>
                                            <div className="loader-text">Do Not Refresh The Page</div>
                                            {/* <ClipLoader color="green" loading={loading} size={100} /> */}
                                        </div>
                                    </div>
                                )}
                                <table className="table table-bordered">
                                    <thead className=" text-primary">
                                        <tr>
                                            <th> # </th>
                                            <th> Model Motor </th>
                                            <th> Make Motor </th>
                                            <th> JDV Code </th>
                                            <th> Qatar QIC Code </th>
                                            <th> Auto Data Code </th>
                                            <th> Location </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.length > 0 ?
                                            <>
                                                {data?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td> {startFrom + index + 1} </td>
                                                        <td> {item.motor_model_name} </td>
                                                        <td> {item.make_motor?.map((data) => data.make_motor_name)} </td>
                                                        <td> {item.jdvDataMedelCode} </td>
                                                        <td> {item.qicModelCode} </td>
                                                        <td> {item.aoutoDataMedelCode} </td>
                                                        <td> {item.motor_model_location?.map((loc, indx) => loc.location_name).join(", ")} </td>
                                                        <td>
                                                            {motorpermission.model_motor?.includes('edit') && (
                                                                <button className="btn btn-primary" onClick={() => { getModelMotor(item._id); }}>Edit</button>
                                                            )}
                                                            {' '}
                                                            {motorpermission.model_motor?.includes('delete') && (
                                                                <>
                                                                    {
                                                                        item.motor_model_status === 1 ?
                                                                            <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteModelMotor(item._id, 0) }}>Deactivate</button> :
                                                                            <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteModelMotor(item._id, 1) }}>Activate</button>
                                                                    }
                                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>

                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                            :
                                            <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
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
                    </div>
                </div>
            </div>
            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/motor-model'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Model Motor</Modal.Title>
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
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Model Motor Name</label>
                                                            <input type="text" className="form-control" placeholder="Model Motor Name" name="model_motor_name" autoComplete="off" required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Make Motor</label>
                                                            <select className="form-control" name="make_motor" required>
                                                                <option value="">Select Make Motor</option>
                                                                {make_motor?.map((item, index) => (
                                                                    <option key={index} value={item._id}>{item.make_motor_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Location</label>
                                                            <Multiselect
                                                                options={location}
                                                                selectedValues={location}
                                                                displayValue="location_name"
                                                                onSelect={setSelectedOption}
                                                                onRemove={setSelectedOption}
                                                                placeholder="Select Location"
                                                                showCheckbox={true}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">Status</label>
                                                    <select className="form-control" name="status" required>
                                                        <option value="">Select Status</option>
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
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
            </Modal>
            <CModal alignment="center" visible={qatarvisible} onClose={() => setQatarVisible(false)}>
                <CModalHeader onClose={() => setQatarVisible(false)}>
                    <CModalTitle>Upload Qatar Make Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div >
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setQatarExcelfile(e.target.files[0])} />
                    </div>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setQatarVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={collectQatarExceldata} href={'/motor-make'}>Upload</CButton>
                </CModalFooter>
            </CModal>
            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Model Motor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-body">
                                            <form action="/" method="POST" onSubmit={updateSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Model Motor Name</label>
                                                            <input type="text" className="form-control" placeholder="Model Motor Name" name="model_motor_name" defaultValue={model_motor_name} autoComplete="off" required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Make Motor</label>
                                                            <select className="form-control" name="make_motor" required>
                                                                <option value="">Select Make Motor</option>
                                                                {make_motor?.map((item, index) => (
                                                                    <option key={index} value={item._id} selected={model_motor_make == item._id ? true : false}>{item.make_motor_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Location</label>
                                                            <Multiselect
                                                                options={location}
                                                                selectedValues={selectedOption}
                                                                onSelect={handleChange}
                                                                onRemove={handleChange}
                                                                displayValue="label"
                                                                placeholder="Select Location"
                                                                closeOnSelect={false}
                                                                avoidHighlightFirstOption={true}
                                                                showCheckbox={true}
                                                                style={{ chips: { background: "#007bff" } }}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Status</label>
                                                        <select className="form-control" name="status" required>
                                                        <option value="">Select Status</option>
                                                        <option value="1" selected={model_motor_status == 1 ? true : false}>Active</option>
                                                        <option value="0" selected={model_motor_status == 0 ? true : false}>Inactive</option>
                                                        </select>
                                                    </div>
                                                </div> */}
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModelMotor;
