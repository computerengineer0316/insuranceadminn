import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CWidgetStatsC } from '@coreui/react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import {
  CChartBar,
  CChartPie,
} from '@coreui/react-chartjs'
import Multiselect from 'multiselect-react-dropdown';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import AdminToplegend from './AdminToplegend';
import AdminGraph from './AdminGraph';


function AdminDashboard() {
  const state = {
    lazyLoad: true,
    responsive: {
      0: {
        items: 1,
      },
      450: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 4,
      },
    },
  }


  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [lob, setLob] = useState([]);
  const [selectedlob, setSelectedLOB] = useState();
  const [businessType, setBusinessType] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState();
  const [agenttype, setAgenttype] = useState([])
  const [agent, setAgent] = useState([]);
  const [adminagentlist, setAdminagentlist] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState();
  const [dateRange, setDateRange] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [fromdateValue, onFromDateChange] = useState(new Date());
  const [todateValue, onToDateChange] = useState(new Date());


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      const userdata = JSON.parse(localStorage.getItem('user'));
      const business_type = userdata.admin_business_type;
      if (business_type.length > 0) {
        const businessdt = business_type;
        const business_len = businessdt.length;
        const business_list = [];
        for (let i = 0; i < business_len; i++) {
          let btype;
          btype = businessdt[i].type;
          btype = btype.split(' ');
          const business_obj = { label: businessdt[i].type, value: btype[0] };
          business_list.push(business_obj);
        }
        setBusinessType(business_list);
      }
      else {
        const Business_type = [
          { label: "New Business", value: "New" },
          { label: "Renewal Business", value: "Renewal" }
        ];
        setBusinessType(Business_type);
      }
      locationList();
      lobList();
      usertypelist();
      // adminagent();

    }
  }, []);

  useEffect(() => {
    agentList();

  }, [agenttype])




  const locationList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const loc = userdata.location;
    if (loc.length > 0) {
      const locationdt = loc;
      const location_len = locationdt.length;
      const location_list = [];
      for (let i = 0; i < location_len; i++) {
        const location_obj = { label: locationdt[i].loc_name, value: locationdt[i].loc_id };
        location_list.push(location_obj);
      }
      setLocation(location_list);
    }
    else {
      const requestOptions =
      {
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
        });
    }
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

  const usertypelist = async (agenttype) => {
    setAgenttype(agenttype);

  }

  console.log(agenttype);

  // const agentList = () => 
  // {
  //   const userdata = JSON.parse(localStorage.getItem('user'));
  //   const id = userdata._id;
  //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>",id);
  //   if(userdata.usertype === '64622470b201a6f07b2dff22')
  //   {
  //     const user_type = "646224deb201a6f07b2dff32";

  //     const requestOptions =
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         user_type: user_type,
  //       }),
  //     };
  //     fetch(`https://insuranceapi-3o5t.onrender.com/api/get_staff_base_usertype`, requestOptions)
  //       .then(response => response.json())
  //       .then(data =>
  //       {
  //         const agentdt = data.data;
  //         const agent_len = agentdt.length;
  //         const agent_list = [];
  //         for (let i = 0; i < agent_len; i++)
  //         {
  //           const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
  //           agent_list.push(agent_obj);
  //         }
  //         setAgent(agent_list);
  //       });
  //   }
  //   else
  //   {
  //     const agent = userdata.assign_staff;
  //     if (agent != undefined && agent != null && agent != '' && agent.length > 0) 
  //     {
  //       const agentdt = agent;
  //       const agent_len = agentdt.length;
  //       const agent_list = [];
  //       for (let i = 0; i < agent_len; i++) 
  //       {
  //         const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
  //         agent_list.push(agent_obj);
  //       }
  //       setAgent(agent_list);
  //     }
  //   }
  // }

  const loginuser = JSON.parse(localStorage.getItem('user'));
  const loginusertype = loginuser.usertype;

  const agentList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const id = userdata._id;

    if (loginusertype === '646224deb201a6f07b2dff32') {
      fetch(`https://insuranceapi-3o5t.onrender.com/api/getStaffDetailsbyid/${id}`)
        .then(response => response.json())
        .then(data => {
          if (agenttype == 'salesAdvisor') {
            // console.log("staff>>>>>>>>>>",data.data[0].assignSalesAdvisor)


            const agentdt = data.data[0].assignSalesAdvisor;
            if (agentdt != undefined && agentdt.length > 0) {
              const agent_len = agentdt.length;
              const agent_list = [];
              for (let i = 0; i < agent_len; i++) {
                const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
                agent_list.push(agent_obj);
              }
              setAgent(agent_list);

            } else {
              setAgent([]);
              return 'No Options Available';
            }
          }
          else if (agenttype == 'documentChaser') {
            // console.log("staff>>>>>>>>>>",data.data[0].assignDocumentChaser)


            const agentdt = data.data[0].assignDacumentChaser;
            if (agentdt != undefined && agentdt.length > 0) {
              const agent_len = agentdt.length;
              const agent_list = [];
              for (let i = 0; i < agent_len; i++) {
                const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
                agent_list.push(agent_obj);
              }
              setAgent(agent_list);
            } else {
              setAgent([]);
              return 'No Options Available';
            }
          }
          else if (agenttype == 'policyIssuer') {
            // console.log("staff>>>>>>>>>>",data.data[0].assignPolicyIssuer)


            const agentdt = data.data[0].assignPolicyIssuer;
            if (agentdt != undefined && agentdt.length > 0) {
              const agent_len = agentdt.length;
              const agent_list = [];
              for (let i = 0; i < agent_len; i++) {
                const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
                agent_list.push(agent_obj);
              }
              setAgent(agent_list);
            }
            else {
              setAgent([]);
              return 'No Options Available';
            }
          }
          else {
            setAgent([]);
            return 'No Options Available';
          }
        });

    }
    else if (loginusertype === '64622470b201a6f07b2dff22') {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      };

      fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=supervisor`, requestOptions)
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
    }
    else {
      setAgent([]);
    }



    // if(agenttype === '646224deb201a6f07b2dff32')
    // {
    //   const requestOptions =
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   };
    //   fetch(`https://insuranceapi-3o5t.onrender.com/api/getStaffDetailsbyid/${id}`, requestOptions)
    //     .then(response => response.json())
    //     .then(data =>
    //     {
    //       console.log("agent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data);
    //     });      

    // }
    // else
    // {
    //   const agent = userdata.assign_staff;
    //   if (agent != undefined && agent != null && agent != '' && agent.length > 0) 
    //   {
    //     const agentdt = agent;
    //     const agent_len = agentdt.length;
    //     const agent_list = [];
    //     for (let i = 0; i < agent_len; i++) 
    //     {
    //       const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
    //       agent_list.push(agent_obj);
    //     }
    //     setAgent(agent_list);
    //   }
    // }
  }


  // const adminagent = () =>
  // {
  //   const requestOptions =
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=supervisor`, requestOptions)
  //     .then(response => response.json())
  //     .then(data =>
  //     {
  //       console.log("adminagent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data.data);
  //       const agentdt = data.data;
  //       const agent_len = agentdt.length;
  //       const agent_list = [];
  //       for (let i = 0; i < agent_len; i++)
  //       {
  //         const agent_obj = { label: agentdt[i].label, value: agentdt[i].value };
  //         agent_list.push(agent_obj);
  //       }
  //       setAdminagentlist(agent_list);
  //     });
  // }

  // console.log("adminagentlist>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",adminagentlist);




  console.log("agent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", agent);

  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const handlecustomized = () => {
    setShowModal(true);
    setDateRange('customized');
  }

  const defaultFilterOptions =
  {
    defaultlocation: location,
    defaultlob: lob,
    defaultbusinessType: businessType,
    defaultagent: agent,
    defaultdateRange: dateRange,
    startdate: fromdateValue,
    enddate: todateValue,
    userType: agenttype
  };

  const handleFilterChange = (filterName, selectedValue) => {
    switch (filterName) {
      case 'location':
        setSelectedOption(selectedValue);
        break;
      case 'lob':
        setSelectedLOB(selectedValue);
        break;
      case 'businessType':
        setSelectedBusinessType(selectedValue);
        break;
      case 'agent':
        setSelectedAgent(selectedValue);
        break;
      default:
        break;
    }
  };

  const combinedFilterOptions =
  {
    location: selectedOption,
    lob: selectedlob,
    businessType: selectedBusinessType,
    agent: selectedAgent,
    dateRange: dateRange,
  }


  return (
    <>
      <section className='mb-2'>
        <Row>
          <Col className='' sm={5}>
            <h4 id="dashboard" className="card-title mb-0">Dashboard</h4>
          </Col>
          <Col sm={7} className="d-none d-md-block">
            <div className='float-end me-3'>
              <button onClick={() => handleDateRangeChange('daily')}
                className={`${dateRange === 'daily' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Daily</button>
              <button onClick={() => handleDateRangeChange('weekly')}
                className={`${dateRange === 'weekly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Weekly</button>
              <button onClick={() => handleDateRangeChange('monthly')}
                className={`${dateRange === 'monthly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Monthly</button>
              <button onClick={() => handleDateRangeChange('yearly')}
                className={`${dateRange === 'yearly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Yearly</button>
              <button onClick={handlecustomized}
                className={`${dateRange === 'customized' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Customized</button>

            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultlocation.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultlocation}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultlocation}
                  showArrow={true}
                />
                :
                <Multiselect
                  options={defaultFilterOptions.defaultlocation}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('location', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('location', selectedValue)}
                  placeholder="Select location"
                  selectedValues={selectedOption}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultbusinessType.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultbusinessType}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultbusinessType}
                  showArrow={true}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultbusinessType}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                  placeholder="Select business type"
                  selectedValues={selectedBusinessType}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultlob.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultlob}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultlob}
                  showArrow={true}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultlob}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('lob', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('lob', selectedValue)}
                  placeholder="Select line of business"
                  selectedValues={selectedlob}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultagent.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultagent}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultagent}
                  showArrow={true}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultagent}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('agent', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('agent', selectedValue)}
                  placeholder="Select Agents"
                  selectedValues={selectedAgent}
                  showArrow={true}
                />
              }
            </div>
          </Col>
        </Row>
      </section>

      <section className='mb-3'>
        <AdminToplegend
          defaultOptions={defaultFilterOptions}
          filterOptions={combinedFilterOptions}
        />
      </section>
      <section className='tables'>
        {/* <Row>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Leads</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Motor', 'Travel', 'Individual Medical','Other LOB'],
                  datasets: [
                    {
                      data: [28, 5, 10,2],
                      backgroundColor: ['#FF6384', '#007500', '#FFCE56','#36A2EB'],
                      hoverBackgroundColor: ['#FF6384', '#007500', '#FFCE56','#36A2EB'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
          </Col>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Closed Leads</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Motor', 'Travel', 'Individual Medical','Other LOB'],
                  datasets: [
                    {
                      data: [10, 7, 2,1],
                      backgroundColor: ['#FF6384', '#007500', '#FFCE56','#36A2EB'],
                      hoverBackgroundColor: ['#FF6384', '#007500', '#FFCE56','#36A2EB'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
          </Col>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Pending Leads</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Motor', 'Travel', 'Individual Medical','Other LOB'],
                  datasets: [
                    {
                      data: [50,10, 15, 11],
                      backgroundColor: ['#FF6384', '#007500', '#FFCE56','#36A2EB'],
                      hoverBackgroundColor: ['#FF6384', '#007500', '#FFCE56','#36A2EB'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
          </Col>    
        </Row>
        <Row>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#f87979',
                      data: [0, 5, 10, 15, 20, 3, 6, 9, 12, 15, 18, 21, 24],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
          </Col>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Closed Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#f87979',
                      data: [0, 5, 10, 15, 20, 3, 6, 9, 12, 15, 18, 21, 24],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
          </Col>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Pending Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#f87979',
                      data: [0, 5, 10, 15, 20, 3, 6, 9, 12, 15, 16, 17, 18],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
          </Col>
        </Row>

        <Row>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Classification of Total Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['Hot', 'Warm', 'Cold'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#1848A4',
                      data: [4, 7, 9],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
          </Col>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Booked Premium</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#1848A4',
                      data: [0, 5, 10, 15, 20, 3, 6, 9, 12, 15, 16, 17, 18],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
          </Col>
          <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Earned Commission</CCardHeader>
            <CCardBody>
              <CChartBar
                labels="months"
                data={{
                  labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                  label: 'No. of Leads',
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#1848A4',
                      data: [0, 5, 10, 15, 20, 3, 6, 9, 12, 15, 16, 17, 18],
                    },
                  ],
                }}
                // labels="months"
              />
            </CCardBody>
          </CCard>
          </Col>
        </Row> */}
        <AdminGraph
          defaultOptions={defaultFilterOptions}
          filterOptions={combinedFilterOptions}
        />

      </section>
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Custom Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <label htmlFor="">From</label>
              <DatePicker
                onChange={onFromDateChange}
                value={fromdateValue}
                format="dd/MM/yyyy"
                autoFocus={true}
                inline
                calendarClassName="custom-datepicker"
                closeCalendar={false}
              />
            </Row>
            <Row>
              <label htmlFor="">To</label>
              <DatePicker
                onChange={onToDateChange}
                value={todateValue}
                format="dd/MM/yyyy"
                autoFocus={true}
                inline
                calendarClassName="custom-datepicker"
                closeCalendar={false} />
            </Row>
          </Container>

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
export default AdminDashboard;
