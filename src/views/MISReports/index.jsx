import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Container, Row, Col, Modal, Button, Accordion } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import PerformanceGraph from './SalesAdvisorReports/PerformanceGraph';
import ClosingRatio from './SalesAdvisorReports/ClosingRatio';
import SpecialIncentive from './CustomerIncentiveReports/SpecialIncentive';
import WithSAIntervention from './CustomerIncentiveReports/WithSAIntervention';
import WithoutSAIntervention from './CustomerIncentiveReports/WithoutSAIntervention';
import ActiveTimePeriod from './ActivityReports/ActiveTimePeriod';
import MarketResponseVsDiscount from './MarketAnalysis/MarketResponseVsDiscount';
import PendingLeadsPolicies from './PendingLeadsPolicies';
import AutoVsManualDealClose from './AutoVsManualDealClose';
import HighestLowestRates from './MarketAnalysis/ComparativeAnalysis/HighestLowestRates';
import AverageRates from './MarketAnalysis/ComparativeAnalysis/AverageRates';
import ProductiveDayOfWeek from './ActivityReports/ProductiveDayOfWeek';

function MISReports() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    location: [],
    selectedOption: [],
    lob: [],
    selectedLOB: [],
    businessType: [],
    selectedBusinessType: [],
    agenttype: null,
    agent: [],
    selectedAgent: [],
    dateRange: 'daily',
    showModal: false,
    fromdateValue: new Date(),
    todateValue: new Date(),
    supervisor: [],
    selectedSupervisor: [],
    totalLeads: 0,
    activeKey: "0"
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const userdata = JSON.parse(localStorage.getItem('user'));
      const business_type = userdata.admin_business_type;
      setState(prevState => ({
        ...prevState,
        businessType: business_type.length > 0
          ? business_type.map(b => ({ label: b.type, value: b.type.split(' ')[0] }))
          : [
            { label: "New Business", value: "New" },
            { label: "Renewal Business", value: "Renewal" }
          ]
      }));
      locationList();
      lobList();
      usertypelist();
      supervisorlist();
    }
  }, []);

  useEffect(() => {
    agentList();
  }, [state.agenttype]);

  useEffect(() => {
    usertypelist();
  }, [state.selectedSupervisor]);

  const locationList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const loc = userdata.location;
    if (loc.length > 0) {
      const location_list = loc.map(l => ({ label: l.loc_name, value: l.loc_id }));
      setState(prevState => ({ ...prevState, location: location_list }));
    }
  };

  const lobList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const lob = userdata.line_of_business;
    if (lob.length > 0) {
      const lob_list = lob.map(l => ({ label: l.lob_name, value: l.lob_id }));
      setState(prevState => ({ ...prevState, lob: lob_list }));
    }
  };

  const usertypelist = async (agenttype) => {
    setState(prevState => ({ ...prevState, agenttype }));
  };

  const supervisorlist = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };

    fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=supervisor`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setState(prevState => ({ ...prevState, supervisor: data.data }));
      });
  };

  const agentList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const id = userdata._id;
    const loginusertype = userdata.usertype;

    if (loginusertype === '646224deb201a6f07b2dff32' || loginusertype === '64622470b201a6f07b2dff22') {
      const supervisorId = state.selectedSupervisor.length > 0 ? state.selectedSupervisor[0] : id;

      fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType??userType=${state.agenttype}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(response => response.json())
        .then(data => {
          const agentdt = data.data;
          const agent_len = agentdt?.length;
          const agent_list = [];
          for (let i = 0; i < agent_len; i++) {
            const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
            agent_list.push(agent_obj);
          }
          if (agent_list.length > 0) {
            setState(prevState => ({ ...prevState, agent: agent_list }));
          } else {
            setState(prevState => ({ ...prevState, agent: [] }));
          }

        });
    } else {
      setState(prevState => ({ ...prevState, agent: [] }));
    }
  };

  const handlesupervisor = (value) => {
    const supervisorArray = value === "" ? [] : Array.isArray(value) ? value : [value];
    setState(prevState => ({
      ...prevState,
      selectedSupervisor: supervisorArray,
      agenttype: ""
    }));
  };

  const handleDateRangeChange = (dateRange) => {
    setState(prevState => ({ ...prevState, dateRange }));
  };

  const handlecustomized = () => {
    setState(prevState => ({
      ...prevState,
      showModal: true,
      dateRange: 'customized'
    }));
  };

  const handleFilterChange = (filterName, selectedValue) => {
    setState(prevState => ({ ...prevState, [filterName]: selectedValue }));
  };

  const handleSelect = (eventKey) => {
    setState(prevState => ({ ...prevState, activeKey: eventKey }));
  };

  const defaultFilterOptions = {
    defaultlocation: state.location,
    defaultlob: state.lob,
    defaultbusinessType: state.businessType,
    defaultagent: state.agent,
    defaultdateRange: state.dateRange,
    startdate: state.fromdateValue,
    enddate: state.todateValue,
    userType: state.agenttype,
    selectedSupervisor: state.selectedSupervisor
  };

  const combinedFilterOptions = {
    location: state.selectedOption,
    lob: state.selectedLOB,
    businessType: state.selectedBusinessType,
    agent: state.selectedAgent,
    dateRange: state.dateRange,
  };

  const loginuser = JSON.parse(localStorage.getItem('user'));
  const loginusertype = loginuser.usertype;
  console.log("activeKey=>", state.activeKey)
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
                className={`${state.dateRange === 'daily' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Daily</button>
              <button onClick={() => handleDateRangeChange('weekly')}
                className={`${state.dateRange === 'weekly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Weekly</button>
              <button onClick={() => handleDateRangeChange('monthly')}
                className={`${state.dateRange === 'monthly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Monthly</button>
              <button onClick={() => handleDateRangeChange('yearly')}
                className={`${state.dateRange === 'yearly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Yearly</button>
              <button onClick={handlecustomized}
                className={`${state.dateRange === 'customized' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Customized</button>
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {state.location.length < 2 ?
                <Multiselect
                  options={state.location}
                  displayValue="label"
                  selectedValues={state.location}
                  showArrow={false}
                />
                :
                <Multiselect
                  options={state.location}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('selectedOption', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('selectedOption', selectedValue)}
                  placeholder="Select location"
                  selectedValues={state.selectedOption}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {state.businessType.length < 2
                ?
                <Multiselect
                  options={state.businessType}
                  displayValue="label"
                  selectedValues={state.businessType}
                  showArrow={false}
                />
                :
                <Multiselect
                  options={state.businessType}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('selectedBusinessType', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('selectedBusinessType', selectedValue)}
                  placeholder="Select business type"
                  selectedValues={state.selectedBusinessType}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {state.lob.length < 2
                ?
                <Multiselect
                  options={state.lob}
                  displayValue="label"
                  selectedValues={state.lob}
                  showArrow={false}
                />
                :
                <Multiselect
                  options={state.lob}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('selectedLOB', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('selectedLOB', selectedValue)}
                  placeholder="Select line of business"
                  selectedValues={state.selectedLOB}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          {loginusertype === '646224deb201a6f07b2dff32' &&
            <Col className='mb-3' sm={3}>
              <div>
                <select className='form-control transparentclass' onChange={(e) => usertypelist(e.target.value)}>
                  <option hidden>Select User Type</option>
                  <option value="">All</option>
                  <option value="salesAdvisor">Sales Advisor</option>
                  <option value="documentChaser">Document Chaser</option>
                  <option value="policyIssuer">Policy Issuer</option>
                </select>
              </div>
            </Col>
          }
          {loginusertype === '64622470b201a6f07b2dff22' ?
            <>
              <Col className='mb-3' sm={3}>
                <div>
                  <select className='form-control transparentclass' onChange={(e) => handlesupervisor(e.target.value)} >
                    <option hidden>Select Supervisor</option>
                    <option value="">All</option>
                    {state.supervisor?.map((item, index) => (
                      <option key={index} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col className='mb-3' sm={3}>
                <div>
                  <select
                    className='form-control transparentclass'
                    onChange={(e) => usertypelist(e.target.value)}
                    value={state.agenttype}
                    placeholder="Select User Type"
                  >
                    <option hidden>Select User Type</option>
                    <option value="">All</option>
                    <option value="salesAdvisor">Sales Advisor</option>
                    <option value="documentChaser">Document Chaser</option>
                    <option value="policyIssuer">Policy Issuer</option>
                  </select>
                </div>
              </Col>
              <Col className='mb-3' sm={3}>
                <div>
                  {state.agent.length < 2
                    ?
                    <Multiselect
                      options={state.agent}
                      displayValue="label"
                      selectedValues={state.agent}
                      showArrow={false}
                    />
                    :
                    <Multiselect
                      options={state.agent}
                      displayValue="label"
                      onSelect={(selectedValue) => handleFilterChange('selectedAgent', selectedValue)}
                      onRemove={(selectedValue) => handleFilterChange('selectedAgent', selectedValue)}
                      placeholder="Select Agents"
                      selectedValues={state.selectedAgent}
                      showArrow={true}
                    />
                  }
                </div>
              </Col>
            </>
            :
            <Col className='mb-3' sm={3}>
              <div>
                {state.agent.length < 2
                  ?
                  <Multiselect
                    options={state.agent}
                    displayValue="label"
                    selectedValues={state.agent}
                    showArrow={false}
                  />
                  :
                  <Multiselect
                    options={state.agent}
                    displayValue="label"
                    onSelect={(selectedValue) => handleFilterChange('selectedAgent', selectedValue)}
                    onRemove={(selectedValue) => handleFilterChange('selectedAgent', selectedValue)}
                    placeholder="Select Agents"
                    selectedValues={state.selectedAgent}
                    showArrow={true}
                  />
                }
              </div>
            </Col>
          }</Row>
      </section>


      <section className='tables'>
        <Row>
          <Accordion onSelect={handleSelect} defaultActiveKey={"0"}>
            <PerformanceGraph
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <ClosingRatio
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <SpecialIncentive
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <WithSAIntervention
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <WithoutSAIntervention
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <ActiveTimePeriod
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <ProductiveDayOfWeek
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <MarketResponseVsDiscount
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <PendingLeadsPolicies
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />

            <AutoVsManualDealClose
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />

            <HighestLowestRates
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
            <AverageRates
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
              activeKey={state.activeKey}
            />
          </Accordion>
        </Row>
      </section>

      <Modal size='lg' show={state.showModal} onHide={() => setState(prevState => ({ ...prevState, showModal: false }))}>
        <Modal.Header closeButton>
          <Modal.Title>Custom Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <label htmlFor="">From</label>
              <DatePicker
                onChange={(date) => setState(prevState => ({ ...prevState, fromdateValue: date }))}
                value={state.fromdateValue}
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
                onChange={(date) => setState(prevState => ({ ...prevState, todateValue: date }))}
                value={state.todateValue}
                format="dd/MM/yyyy"
                autoFocus={true}
                inline
                calendarClassName="custom-datepicker"
                closeCalendar={false}
              />
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setState(prevState => ({ ...prevState, showModal: false }))}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MISReports;