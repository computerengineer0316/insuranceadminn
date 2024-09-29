import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import Multiselect from 'multiselect-react-dropdown';



ProducerGenerateLink.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes

    })
};

ProducerGenerateLink.propTypes = {
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultagent: PropTypes.string,
        defaultdateRange: PropTypes,
        startdate: PropTypes,
        enddate: PropTypes,

    })
};



ProducerGenerateLink.propTypes = {
    updateSharedData: PropTypes.func.isRequired,
};

function ProducerGenerateLink({ filterOptions, defaultOptions, updateSharedData }) {

    const token = localStorage.getItem('token');
    const [url, setUrl] = useState(''); // State to store the generated URL
    const [userurl, setUserurl] = useState(''); // State to store the generated URL
    const [copied, setCopied] = useState(false);
    const [whatsappnumber, setWhatsappnumber] = useState(''); // State to store the generated URL
    const [email, setEmail] = useState(''); // State to store the generated URL


    const navigate = useNavigate();
    const [newleaddata, setNewleadData] = useState([]);
    const [leadstatus, setLeadStatus] = useState([]);
    const [leaddetails, setLeadDetails] = useState([]);
    const [line_of_business_name, setLineOfBusinessName] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState('');
    const [lead_status, set_Lead_Status] = useState({});
    const [direct_payment, set_Direct_Payment] = useState({});
    const [dclist, setDcList] = useState([]);
    const [assigndc, setAssignDc] = useState('');
    const [loading, setLoading] = useState(false);
    const [lob, setLob] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlist(page, perPage);
            getsalists();
        }
    }, [filterOptions]);

    useEffect(() => {
        lobList();
    }
        , []);

    const getlist = async (page, perPage) => {
        try {
            setLoading(true);
            let newlocation = filterOptions.location
            let newlob = filterOptions.lob
            let newbusinessType = filterOptions.businessType
            let newagent = filterOptions.agent
            let dateRange = filterOptions.dateRange
            let startdate = defaultOptions.startdate
            let enddate = defaultOptions.enddate


            if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
                newlocation = defaultOptions.defaultlocation.map((item) => item.value);
                // newlocation = [];
            }
            else {
                newlocation = newlocation.map((item) => item.value);
            }

            if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
                newlob = defaultOptions.defaultlob.map((item) => item.value);
                // newlob = [];
            }
            else {
                newlob = newlob.map((item) => item.value);
            }

            if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
                newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
                // newbusinessType = [];

            }
            else {
                newbusinessType = newbusinessType.map((item) => item.value);
            }

            if (newagent == null || newagent == undefined || !Array.isArray(newagent) || newagent.length === 0) {
                newagent = defaultOptions.defaultagent.map((item) => item.value);
            } else {
                newagent = newagent.map((item) => item.value);
            }

            const token = localStorage.getItem('token');
            const loginuser = JSON.parse(localStorage.getItem('user'));
            const loginusertype = loginuser.usertype;

            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({
                    // page: page,
                    // limit: perPage,
                    location: newlocation,
                    lob: newlob,
                    business_type: newbusinessType,
                    newagent: newagent,
                    dateRange: dateRange,
                    startdate: startdate,
                    enddate: enddate
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            };

            await fetch(`https://insuranceapi-3o5t.onrender.com/api/businessEntityLinks?page=${page}&limit=${perPage}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data)
                    const total = data.count;
                    console.log('total>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', total)
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    const list = data.data;
                    setNewleadData(list);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error)
                })
        }
        catch (error) {
            console.log(error)
        }
    }

    console.log('newleaddata>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', newleaddata)

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlist(selectedPage + 1, perPage, localStorage.getItem('lob'));
    };

    const startFrom = (page - 1) * perPage;


    const user = localStorage.getItem('user');
    const userid = JSON.parse(user)._id;

    console.log('userid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', userid)


    const generateLink = () => {
        const baseUrl = `https://insuranceapi-3o5t.onrender.com?${userid}`;
        const generatedUrl = baseUrl;
        setUrl(generatedUrl);
    };

    // const generateUserLink = () => {
    //     const baseUrl = `https://lmpfrontend.handsintechnology.in/${token}&user=BE`;
    //     const generatedUrl = baseUrl;
    //     setUserurl(generatedUrl);
    // };

    const whatsapp = async () => {

        try {
            if (url == '') {
                alert('Please generate link first')
            }
            else if (whatsappnumber == '') {
                alert('Please enter whatsapp number')
            }
            else {
                const whatsappLink = `https://wa.me/${whatsappnumber}`;
                window.open(whatsappLink);

                await fetch('https://insuranceapi-3o5t.onrender.com/api/businessEntityLink', {
                    method: 'post',
                    body: JSON.stringify({
                        number: whatsappnumber,
                        link: url
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    })
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    const handleEmailsend = async () => {

        console.log(url)
        if (email == '') {
            alert('Please enter email')
        }
        else if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter valid email')
        }
        else if (url == '') {
            alert('Please generate link first')
        }
        else {

            try {
                const mailtoLink = `mailto:${email}`;
                window.open(mailtoLink);

                await fetch('https://insuranceapi-3o5t.onrender.com/api/businessEntityLink', {
                    method: 'post',
                    body: JSON.stringify({
                        email: email,
                        link: url
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    })
            }
            catch (error) {
                console.log(error)
            }
        }

    }

    const handlemodal = () => {
        setShowModal(true);
    }

    const lobList = () => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        const lob = userdata.line_of_business;
        if (lob.length > 0) {
            const lobdt = lob;
            const lob_len = lobdt.length;
            const lob_list = [];
            for (let i = 0; i < lob_len; i++) {
                const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
                lob_list.push(lob_obj);
            }
            setLob(lob_list);
        }
        else {
            const requestOptions =
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const lobdt = data.data;
                    const lob_len = lobdt.length;
                    const lob_list = [];
                    for (let i = 0; i < lob_len; i++) {
                        const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
                        lob_list.push(lob_obj);
                    }
                    setLob(lob_list);
                });
        }
    }




    const [formData, setFormData] = useState({
        phonenumber: '',
        email: '',
    });
    const [selectedlob, setSelectedLob] = useState([]);
    const [selectedagent, setSelectedAgent] = useState('');


    const handleLocationSelect = (selectedList) => {
        console.log(selectedList)
        setSelectedLob(selectedList);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.selectedlob == []) {
                alert('Please select location')
            }
            else if (formData.phonenumber == '') {
                alert('Please enter phone number')
            }
            else if (formData.email == '') {
                alert('Please enter email')
            } else if (formData.name == '') {
                alert('Please enter name')
            }
            else if (!formData.email.includes('@') || !formData.email.includes('.')) {
                alert('Please enter valid email')
            }
            else if (selectedagent == '' && loginusertype == '64622470b201a6f07b2dff22') {
                alert('Agent Required')
            }
            else {

                if (loginusertype == '66068569e8f96a29286c956e') {
                    const requestOptions = {
                        method: 'POST',
                        body: JSON.stringify({
                            lob: selectedlob.map((item) => item.value),
                            phoneno: formData?.phonenumber,
                            email: formData?.email,
                            name: formData?.name,
                            // producerId: selectedagent
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                    };

                    fetch(`https://insuranceapi-3o5t.onrender.com/api/createProducerLeads`, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.data)
                            alert('Link Generated Successfully')

                            setFormData({
                                phonenumber: '',
                                email: '',
                            });
                            setSelectedLob([]);
                            setUrl(data.data);
                            setShowModal(false);
                            navigate('/ProducerDashboard')
                        });
                }

                if (loginusertype == '64622470b201a6f07b2dff22') {

                    const requestOptions = {
                        method: 'POST',
                        body: JSON.stringify({
                            lob: selectedlob.map((item) => item.value),
                            phoneno: formData?.phonenumber,
                            email: formData?.email,
                            name: formData?.name,
                            producerId: selectedagent
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                    };

                    fetch(`https://insuranceapi-3o5t.onrender.com/api/createProducerLeads`, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.data)
                            alert('Link Generated Successfully')

                            setFormData({
                                phonenumber: '',
                                email: '',
                            });
                            setSelectedLob([]);
                            setUrl(data.data);
                            setShowModal(false);
                            navigate('/ProducerDashboard')
                        });
                }


            }
        }
        catch (error) {
            console.log(error)
        }
    };


    const loginuser = JSON.parse(localStorage.getItem('user'));
    const loginusertype = loginuser.usertype;

    const [agent, setAgent] = useState([]);
    const getsalists = async () => {
        try {
            const requestOptions =
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            };

            fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=producer`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("adminagent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data.data);
                    const agentdt = data.data;
                    const agent_len = agentdt?.length;
                    const agent_list = [];
                    for (let i = 0; i < agent_len; i++) {
                        const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
                        agent_list.push(agent_obj);
                    }
                    setAgent(agent_list);
                });
        } catch (error) {
            console.log(error)
        }
    }


    console.log('agent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', agent)



    return (
        <>
            <div className="row mb-5">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title" style={{ marginBottom: '0px', fontSize: '15px' }}>Link Generator</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div>
                                <button className='generated_links' style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '5px' }} onClick={handlemodal}>Generate Customer Link</button>

                                {/* {url && (
                                    <div className='links_generaed'>
                                        <p>Generated Customer Link:</p>
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                            {url}
                                        </a>

                                    </div>
                                )} */}
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Select line of business </strong></label>
                                                    <Multiselect
                                                        options={lob}
                                                        displayValue="label"
                                                        onSelect={(selectedValue) => handleLocationSelect(selectedValue)}
                                                        onRemove={(selectedValue) => handleLocationSelect(selectedValue)}
                                                        placeholder="Select line of business"
                                                        selectedValues={selectedlob}
                                                        showArrow={true}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Name</strong></label>
                                                    <input
                                                        type='text'
                                                        className="form-control"
                                                        name='name'
                                                        placeholder="Enter Name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Phone Number</strong></label>
                                                    <input
                                                        type='number'
                                                        className="form-control"
                                                        name='phonenumber'
                                                        placeholder="Enter Phone Number"
                                                        value={formData.phonenumber}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Email</strong></label>
                                                    <input
                                                        type='email'
                                                        className="form-control"
                                                        name='email'
                                                        placeholder="Enter Email Address"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                {loginusertype == '64622470b201a6f07b2dff22' && (
                                                    <div className="col-md-6">
                                                        <label className="form-label"><strong>Agent</strong></label>
                                                        <select
                                                            className='form-control'
                                                            onChange={(e) => setSelectedAgent(e.target.value)}
                                                        >
                                                            <option value=''>Select Agent</option>
                                                            {
                                                                agent?.map((item, index) => (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {/* <Multiselect
                                                        options={agent}
                                                        displayValue="label"
                                                        onSelect={(selectedValue) => setSelectedAgent(selectedValue)}
                                                        onRemove={(selectedValue) => setSelectedAgent(selectedValue)}
                                                        placeholder="Select Agent"
                                                        selectedValues={selectedagent}
                                                        showArrow={true}
                                                    /> */}
                                                    </div>
                                                )}

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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>




        </>
    )
}

export default ProducerGenerateLink