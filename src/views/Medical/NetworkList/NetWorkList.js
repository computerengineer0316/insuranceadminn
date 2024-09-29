import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReacNetworkginate from "react-paginate";
import filePath from '../../../webroot/sample-files/medical-network-list.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
import "react-datepicker/dist/react-datepicker.css";

const
    MedicalNetworkList = () => {
        const navigate = useNavigate();
        const [data, setData] = useState([]);
        const [perPage] = useState(10);
        const [pageCount, seNetworkgeCount] = useState(0);
        const [page, seNetworkge] = useState(1);
        const [excelfile, setExcelfile] = useState("");
        const [usertype, setUsertype] = useState('');
        const [usertype_status, setUsertypestatus] = useState('');
        const [id, setId] = useState('');
        const [visible, setVisible] = useState(false);
        const [showModal, setShowModal] = useState(false);
        const [visibleedit, setVisibleedit] = useState(false);
        const [masterpermission, setMasterpermission] = useState([]);
        const [selectedOption, setSelectedOption] = useState([]);
        const [SelectedNetworkids, setSelectedNetworkids] = useState([]);
        const [Networkids, setNetworkids] = useState([]);
        const [selectedTPA, setSelectedTPA] = useState("");
        const [selectedPlan, setSelectedPlan] = useState("");
        const [location, setLocation] = useState([]);
        const [medicalNetwork, setMedicalNetwork] = useState('');
        const [medicalNetworktatus, setmedicalNetworktatus] = useState('');
        const [medicalNetworkid, setMedicalNetworkid] = useState('');
        const [medicalNetworkedit, setMedicalNetworkedit] = useState('');
        const [defaultPlancategories, setdefaultPlanCategories] = useState([])
        const [activeMedicalTPA, setactiveMedicalTPA] = useState([])
        const [ActiveMedicalNetwork, setActiveMedicalNetwork] = useState([])
        const [planCategory, setPlanCategory] = useState('')
        useEffect(() => {
            const token = localStorage.getItem('token');
            if (token === null || token === undefined || token === '') {
                navigate('/login')
            }
            else {
                getNetwork(page, perPage);
                const userdata = JSON.parse(localStorage.getItem('user'));
                const master_permission = userdata?.medical_permission?.[0] || {};
                setMasterpermission(master_permission);
                exportlistdata();
                locationList();
                activeMedicalTPAList();
                getAllPlanCategories();
                activeMedicalNetwork();
            }
        }, [])
        const activeMedicalNetwork = () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    setActiveMedicalNetwork(data.data)
                });
        }
        const getAllPlanCategories = () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllPlanCategories`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setdefaultPlanCategories(data.data)
                    console.log(">>>>>>>>plancategory>>>>", data.data)
                    setSelectedPlan(data?.data?.[0]["_id"])
                });
        }
        const activeMedicalTPAList = () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const locationdt = data.data;
                    setactiveMedicalTPA(locationdt)
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
                    setLocation(locationdt);
                    handleChange(locationdt);
                });
        }
        const getNetwork = (page, perPage) => {
            setData([]);
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalNetworkList?limit=${perPage}&page=${page}`, requestOptions)
                .then(response => response.json())
                .then(
                    data => {
                        const total = data.count;
                        const slice = total / perPage;
                        const pages = Math.ceil(slice);
                        seNetworkgeCount(pages);
                        const list = data.data;
                        setData(list)
                    }
                );
        }


        const [exportlist, setExportlist] = useState([]);
        const exportlistdata = () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch('https://insuranceapi-3o5t.onrender.com/api/medicalNetworkList', requestOptions)
                .then(response => response.json())
                .then(data => {
                    setExportlist(data.data);
                });
        }
        const fileType = 'xlsx'
        const exporttocsv = () => {
            const updatedData = exportlist.map((item, index) => {
                return {
                    'Name': item.name,
                    'Plan Category': item.plan_categories?.map((val) => val.plan_category_name).join(", "),
                    'TPA': item.tpa?.map((val) => val.name).join(", "),
                    'Network': item.medical_networks?.map((val) => val.name).join(", "),
                    'Location': item.location?.map((val) => val.location_name).join(", "),
                }
            })
            const ws = XLSX.utils.json_to_sheet(updatedData);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
            const newdata = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(newdata, "Medical-Netowork-list" + ".xlsx")
        }

        const handlePageClick = (e) => {
            const selectedPage = e.selected;
            seNetworkge(selectedPage + 1);
            getNetwork(selectedPage + 1, perPage);
        };


        const updatestatus = async (id, status) => {

            let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalNetworkList?id=${id}`, {
                method: 'put',
                body: JSON.stringify({ status: status }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            result = await result.json();
            swal("Updated Succesfully", "", "success");
            getNetwork(page, perPage)
        }

        const collectExceldata = async (e) => {
            e.preventDefault()
            const fd = new FormData()
            fd.append('file', excelfile)
            let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_medical_network_list_excel ",
                {
                    method: "post",
                    body: fd,
                })
            result = await result.json();
            if (result.status == 200) {
                setVisible(!visible)
                swal({
                    text: result.message,
                    type: "success",
                    icon: "success",
                    button: false,
                })
                getNetwork(page, perPage);
                setTimeout(() => {
                    swal.close()
                }, 1000);
            }
            else {
                setVisible(!visible)
                swal({
                    title: "Error!",
                    text: result.message,
                    type: "error",
                    icon: "error",
                    button: "ok",
                })
                getNetwork(page, perPage);
                setTimeout(() => {
                    swal.close()
                }, 1000);
            }
        }


        const getdetails = async (ParamValue) => {
            setId(ParamValue);
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalNetworkListBYId?id=${ParamValue}`, requestOptions);
            result = await result.json();
            setMedicalNetwork(result.data[0]?.name);
            setmedicalNetworktatus(result.data[0]?.status);
            const locationid = result.data[0]?.locations;
            const tpa = result.data[0]?.TPAData;
            setSelectedNetworkids(result.data[0].networkData ? result.data[0].networkData : []);
            setPlanCategory(result.data[0]?.planCategory[0]?._id);
            setSelectedTPA(tpa?.[0]?._id)
            setSelectedOption(locationid);
            setVisibleedit(true);
        }
        const handleChange = (selectedOption) => {
            setSelectedOption(selectedOption);
        }
        const handleChangeSelectedNetworkids = (SelectedNetworkids) => {
            setSelectedNetworkids(SelectedNetworkids);
        }


        const updateNetwork = async (e) => {
            e.preventDefault();
            if (medicalNetwork == '') {
                swal({

                    text: "Please enter Network",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
                getNetwork(page, perPage);
                setTimeout(() => {
                    swal.close()
                }, 1000);
                return false;
            }
            if (selectedOption == '') {
                swal({

                    text: "Please select location",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
                getNetwork(page, perPage);
                setTimeout(() => {
                    swal.close()
                }, 1000);
                return false;
            }
            if (SelectedNetworkids == '') {
                swal({

                    text: "Please select Newtworks",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
                getNetwork(page, perPage);
                setTimeout(() => {
                    swal.close()
                }, 1000);
                return false;
            }
            const data = new FormData(e.target);
            const planCategory = data.get("planCategory")
            const Network = data.get("name");
            const tpaid = data.get("TPAID");
            const Network_location = selectedOption;
            const Network_location_len = Network_location.length;
            const Network_location_str = [];
            for (let i = 0; i < Network_location_len; i++) {
                Network_location_str.push(Network_location[i]._id);
            }
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalNetworkList?id=${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: Network,
                    location: Network_location_str,
                    TPAID: tpaid,
                    planCategory: planCategory,
                    networkId: SelectedNetworkids.map(item => item?._id)
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        setVisibleedit(false)
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false,
                        })
                        getNetwork(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        setVisibleedit(false)
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false,
                        })
                        getNetwork(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });

        }

        const deleteItem = (id) => {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster/?id=${id}&type=NetworkList`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            icon: "success",
                            button: false,
                        })
                        getNetwork(page, perPage);
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
                        getNetwork(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }

                })
        }
        const AddCondition = () => {
            navigate("/AddmedicalNetworkList")
        }
        const startFrom = (page - 1) * perPage;
        console.log("SelectedNetworkids", SelectedNetworkids)

        const getLinkListByTPAid = (id) => {
            const requestOptions = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getTpaLinkNetwork?tpaId=${id}`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    handleChangeSelectedNetworkids(data.data)

                })
                .catch(error => console.log('error', error));
        }
        return (
            <>
                <Container>
                    <div className="card mb-4">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Network List</h4>
                                </div>
                                <div className="col-md-6">
                                    {masterpermission?.networklist?.includes('create') ?
                                        <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddCondition(true)}>Add Network List</button>
                                        : ''}
                                </div>
                            </div>
                        </div>
                        <div className="card-header" style={{ textAlign: 'right' }}>
                            {masterpermission.networklist?.includes('download') ?
                                <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }}
                                    href={filePath}
                                    download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                : ''}
                            {masterpermission.networklist?.includes('upload') ?
                                <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                : ''}
                            {masterpermission.networklist?.includes('export') ?
                                <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                : ''}
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th scope="col">#</th>
                                        {/* <th scope="col">userId</th> */}
                                        <th scope="col">name</th>
                                        <th scope="col">location</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.length > 0 ?
                                            data.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    {/* <td>{item.userId}</td> */}
                                                    <td>{item.name}</td>
                                                    {/* <td>{new Date(item.startDate).toLocaleString()}</td> */}
                                                    <td>{item.locations.map((val) => val.location_name).join(", ")}</td>
                                                    <td>
                                                        {masterpermission?.networklist?.includes('edit') && (
                                                            <button className="btn btn-primary" onClick={() => getdetails(item._id)}>Edit</button>
                                                        )}
                                                        {' '}
                                                        {masterpermission?.networklist?.includes('delete') && (
                                                            <>
                                                                {
                                                                    item.status === 1 ?
                                                                        <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                        <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                                }
                                                                <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="6">No Data Found</td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                            <ReacNetworkginate
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

                </Container>
                <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                    <CModalHeader onClose={() => setVisible(false)}>
                        <CModalTitle>Upload Excel File</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <div >
                            {/* <label className="form-label"><strong>Upload Excel File</strong></label> */}
                            <input type="file" className="form-control" id="DHA" defaultValue="" required
                                onChange={(e) => setExcelfile(e.target.files[0])} />
                        </div>

                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                        <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                    </CModalFooter>
                </CModal>


                <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Network List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <form action="/" method="POST" onSubmit={updateNetwork} >
                                                <div className="row">
                                                    <div className="col-md-6">

                                                        <label className="form-label"><strong>Name</strong></label>
                                                        <input type='text' className="form-control"
                                                            name='name'
                                                            placeholder='Name'
                                                            defaultValue={medicalNetwork}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">

                                                        <label className="form-label"><strong>TPA</strong></label>
                                                        <select
                                                            onChange={(e) => getLinkListByTPAid(e.target.value)}
                                                            className="form-control" defaultValue={selectedTPA} name="TPAID" placeholder="TPAID" autoComplete="off" required >
                                                            {
                                                                activeMedicalTPA.length > 0 ? (<>
                                                                    {
                                                                        activeMedicalTPA.map((item) => (
                                                                            <option value={item._id} key={item._id}>{item.name}</option>
                                                                        ))
                                                                    }

                                                                </>) : <React.Fragment></React.Fragment>
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label className="form-label"><strong>Plan Category</strong></label>
                                                        <select name='planCategory'

                                                            className="form-control">
                                                            {
                                                                defaultPlancategories.length > 0 ? (<>
                                                                    {
                                                                        defaultPlancategories.map((item) => (
                                                                            <option key={item._id} value={item._id} selected={item._id == planCategory ? true : false}>{item.plan_category_name}</option>
                                                                        ))
                                                                    }
                                                                </>) : <React.Fragment></React.Fragment>
                                                            }
                                                        </select>

                                                    </div>

                                                    <div className="col-md-6">
                                                        <label className="form-label"><strong>Select Networks</strong></label>

                                                        <Multiselect
                                                            options={ActiveMedicalNetwork}
                                                            selectedValues={SelectedNetworkids}
                                                            onSelect={handleChangeSelectedNetworkids}
                                                            onRemove={handleChangeSelectedNetworkids}
                                                            displayValue="name"
                                                            placeholder="Select Networks"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label"><strong>Select Location</strong></label>

                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
                                                            displayValue="location_name"
                                                            placeholder="Select Location"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            required
                                                        />
                                                    </div>
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

export default
    MedicalNetworkList;