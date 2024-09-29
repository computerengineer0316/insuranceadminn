import React, { useEffect, useState } from 'react';
import { CCol, CWidgetStatsC } from '@coreui/react';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import NewLead from './NewLead';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { useNavigate } from 'react-router-dom';
import HotLead from './HotLead';
import ColdLead from './ColdLead';
import WarmLead from './WarmLead';
import LostDropped from './LostDropped';
import PendingPolicies from './PendingPolicies';
import ClosedBussiness from './ClosedBussiness';
import SalesGraph from './SalesGraph';
import SaToplegend from './SaToplegend';
import BELink from 'src/views/business-entity-dashboard/BELink';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState('');
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [lob, setLob] = useState([]);
  const [selectedlob, setSelectedLOB] = useState();
  const [businessType, setBusinessType] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState();
  const [agent, setAgent] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState();
  const [dateRange, setDateRange] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [fromdateValue, onFromDateChange] = useState(new Date());
  const [todateValue, onToDateChange] = useState(new Date());
  const [dashboardCounts, setDashboardCounts] = useState([]);

  const updateSharedData = (newData) => {
    setSharedData(newData);
  };

  useEffect(() => {
    /* Perform the refresh action here, such as fetching new data from an API */
    /* console.log('Data refreshed!'); */
  }, [sharedData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      const userdata = JSON.parse(localStorage.getItem('user'));
      console.log(userdata);
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
      agentList();
      getsaledashboardcount();
      const savedCounts = JSON.parse(localStorage.getItem('dashboardCounts'));
      if (savedCounts) {
        setDashboardCounts(savedCounts);
      }
    }
  }, []);

  const state =
  {
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

  const loginuser = JSON.parse(localStorage.getItem('user'));
  const loginusertype = loginuser.usertype;
  const loginuserlocation = loginuser?.location;
  // const matchid = loginuserlocation.length > 0 ? loginuserlocation[0]['loc_id'] : '';
  let matchid = '';

  if (loginuserlocation && loginuserlocation.length > 0 && loginuserlocation[0]['loc_id']) {
    matchid = loginuserlocation[0]['loc_id'];
  }



  // const agentList = () => 
  // {
  //   const userdata = JSON.parse(localStorage.getItem('user'));
  //   const id = userdata._id;

  //   if(loginusertype === '646224eab201a6f07b2dff36'){

  //   if(userdata.usertype === '64622470b201a6f07b2dff22')
  //   {
  //     const user_type = "646224eab201a6f07b2dff36";

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
  //     const agent = userdata.name;
  //     const agent_obj = { label: agent, value: userdata._id };
  //     const agent_list = [];
  //     agent_list.push(agent_obj);
  //     setAgent(agent_list);
  //   }
  // }

  // if(loginusertype === '64622470b201a6f07b2dff22')
  //   {
  //     const requestOptions =
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     };

  //     fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=salesAdvisor`, requestOptions)
  //     .then(response => response.json())
  //     .then(data =>
  //     { 
  //       console.log("adminagent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data.data);
  //       const agentdt = data.data;
  //       const agent_len = agentdt.length;
  //       const agent_list = [];
  //       for (let i = 0; i < agent_len; i++)
  //       {
  //         const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
  //         agent_list.push(agent_obj);
  //       }
  //       setAgent(agent_list);
  //     });
  //   }
  // }

  const agentList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const id = userdata._id;

    if (loginusertype === '646224eab201a6f07b2dff36') {
      const agent = userdata.name;
      const agent_obj = { label: agent, value: userdata._id };
      const agent_list = [];
      agent_list.push(agent_obj);
      setAgent(agent_list);
    }

    if (loginusertype === '64622470b201a6f07b2dff22') {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      };

      fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=salesAdvisor`, requestOptions)
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

  }

  const getsaledashboardcount = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const usertype = userdata.usertype;
    const userid = userdata._id;

    const requestOptions =
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usertype: usertype,
        userid: userid,
      }),
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_dashboard_count`, requestOptions)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('dashboardCounts', JSON.stringify(data));
        setDashboardCounts(data);
      });
  }

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

  // console.log("from sales dashboard>>>>>>>>>>>>>>>>>>>>>>newlocation", combinedFilterOptions.location)
  //   console.log("from sales dashboard>>>>>>>>>>>>>>>>>>>>>>newlob", combinedFilterOptions.lob)
  //   console.log("from sales dashboard>>>>>>>>>>>>>>>>>>>>>>newbusinessType", combinedFilterOptions.lob)
  //   console.log("from sales dashboard>>>>>>>>>>>>>>>>>>>>>>newagent", combinedFilterOptions.agent)





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
                  showArrow={false}
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
                  showArrow={false}
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
                  showArrow={false}
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
                  showArrow={false}
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
        <Row>
          <SaToplegend
            defaultOptions={defaultFilterOptions}
            filterOptions={combinedFilterOptions}
          />
        </Row>
      </section>

      <section className='mb-3'>
        <BELink
          defaultOptions={defaultFilterOptions}
          filterOptions={combinedFilterOptions}
        />
      </section>


      <section className='tables'>
        <Row>
          <Col className='' lg={12} id='newlead'>
            <NewLead
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <HotLead
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <WarmLead
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <ColdLead
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <PendingPolicies
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <ClosedBussiness
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <LostDropped
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              updateSharedData={updateSharedData}
            />
            <SalesGraph
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              lobdata={lob} />
          </Col>
        </Row>
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
export default SalesDashboard;
