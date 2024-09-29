import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Multiselect from 'multiselect-react-dropdown'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Select from 'react-select'

import "react-datepicker/dist/react-datepicker.css";

const ViewDocumentsList = () => {
  const navigate = useNavigate()
  const [perPage] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [document_details, setDocumentDetails] = useState([])
  const [id, setId] = useState([])
  const [lob, setLob] = useState([])
  const [location, setLocation] = useState([])
  const [documenttype, setDocumentType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [visible, setVisible] = useState(false)
  const [policyType, setPolicyType] = useState([])
  const [gccspec, setGccSpec] = useState([])
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedpolicyType, setSelectedPolicyType] = useState([]);
  const [selectedvehicleBrandNew, setSelectedVehicleBrandNew] = useState([]);
  const [selectedisCurrentYearPolicyStillValid, setSelectedIsCurrentYearPolicyStillValid] = useState([]);
  const [selectedmortgage, setSelectedMortgage] = useState([]);
  const [selectedvehicleSpecification, setSelectedVehicleSpecification] = useState([]);
  const [selectednumberOfYearsOfNoClaim, setSelectedNumberOfYearsOfNoClaim] = useState([]);
  const [document_type, setDocument_Type] = useState('')
  const [newlob, setNewLob] = useState([])
  const [newSelectedLocation, setNewSelectedLocation] = useState([])
  const [newpolicyType, setNewPolicyType] = useState([])
  const [newvehicleBrandNew, setNewVehicleBrandNew] = useState([])
  const [newisCurrentYearPolicyStillValid, setNewIsCurrentYearPolicyStillValid] = useState([])
  const [newmortgage, setNewMortgage] = useState([])
  const [newvehicleSpecification, setNewVehicleSpecification] = useState([])
  const [newnumberOfYearsOfNoClaim, setNewNumberOfYearsOfNoClaim] = useState([])
  const [lobbyid, setLobById] = useState('')
  const [lobtype, setLobType] = useState('')
  const [visa, setVisa] = useState([])
  const [selectedVisa, setSelectedVisa] = useState([])
  const [selectedExpiryDate, setSelectedExpiryDate] = useState('')
  const [newVisa, setNewVisa] = useState([])
  const [newExpiryDate, setNewExpiryDate] = useState('')
  const [numberlabel, setNumberlabel] = useState('')
  const [numberplaceholder, setNumberplaceholder] = useState('')
  const [IssueDatelabel, setIssuedatelabel] = useState('')
  const [IssueDateplaceholder, setIssuedateplaceholder] = useState('')
  const [ExpiryDatelabel, setExpirydatelabel] = useState('')
  const [ExpiryDateplaceholder, setExpirydateplaceholder] = useState('')
  const [insurer, setInsurer] = useState(false)
  const [newInsurer, setNewInsurer] = useState(false)
  const [newnumberlabel, setNewNumberlabel] = useState('')
  const [newnumberplaceholder, setNewNumberplaceholder] = useState('')
  const [newIssueDatelabel, setNewIssuedatelabel] = useState('')
  const [newIssueDateplaceholder, setNewIssuedateplaceholder] = useState('')
  const [newExpiryDatelabel, setNewExpirydatelabel] = useState('')
  const [newExpiryDateplaceholder, setNewExpirydateplaceholder] = useState('')
  const [showGMDocType, setGMDocTypeField] = useState(false)
  const [showGMDocTypeEdit, setGMDocTypeFieldEdit] = useState(false)
  const [gmDocTypeValue, setGMDocTypeValue] = useState('')
  const [showDocCategory, setShowDocCategory] = useState(false)
  const [groupMedicalCategories, setGroupMedicalCategory] = useState([])
  const [selectedDocCategory, setSelectedDocCategory] = useState([])

  useEffect(() => {
    lobList()
    policylist()
    gccSpecList()
    getvisaType()
    locationList()
    getGroupMedicalCategories()
  }, [])

  useEffect(() => {
    getDocuments(page, perPage)
  }, [lobtype])

  useEffect(() => {
    if (selectedOption.value == '658bf04ed4c9b13ffb6ddb8a') {
      setGMDocTypeField(true)
      // setShowDocCategory(true)

    } else if (newlob.value == '658bf04ed4c9b13ffb6ddb8a') {
      setGMDocTypeField(true)
      // setShowDocCategory(true)
    } else {
      setGMDocTypeField(false)
      setShowDocCategory(false)

    }
  }, [selectedOption, newlob])
  const lobList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const lobdt = data.data
        const lob_len = lobdt.length
        const lob_list = []
        for (let i = 0; i < lob_len; i++) {
          const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id }
          lob_list.push(lob_obj)
        }
        setLob(lob_list)
        // handleChange(lob_list)
      })
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
        setSelectedLocation(location_list);
      });
  }

  const policylist = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getPolicyTypes`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const policydt = data.data
        console.log(policydt)
        const policy_len = policydt.length
        const policy_list = []
        for (let i = 0; i < policy_len; i++) {
          const policy_obj = { label: policydt[i].policy_type_name, value: policydt[i]._id }
          policy_list.push(policy_obj)
        }
        setPolicyType(policy_list)
      })
  }

  const gccSpecList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getGccSpecs`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const gccspecdt = data.data
        console.log(gccspecdt)
        const gccspec_len = gccspecdt.length
        const gccspec_list = []
        for (let i = 0; i < gccspec_len; i++) {
          const gccspec_obj = { label: gccspecdt[i].plan_for_gcc_spec_name, value: gccspecdt[i]._id }
          gccspec_list.push(gccspec_obj)
        }
        setGccSpec(gccspec_list)
      })
  }

  const getvisaType = async () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getVisaTypes`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const visadt = data.data
        console.log(visadt)
        const visadt_len = visadt.length
        const visadt_list = []
        for (let i = 0; i < visadt_len; i++) {
          const visadt_obj = { label: visadt[i].medical_plan_condition, value: visadt[i]._id }
          visadt_list.push(visadt_obj)
        }
        setVisa(visadt_list)
      })
  }




  const lobdata = (item) => {
    const lobid = item.document_lob
    const lob_id = lobid.toString().split(',')
    const lob_id_len = lob_id.length
    const lob_name = []
    for (let i = 0; i < lob_id_len; i++) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_by_id/${lob_id[i]}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          lob_name.push(data.data.line_of_business_name)
          const lob_name_len = lob_name.length
          if (lob_name_len === lob_id_len) {
            const lob_name_str = lob_name.join(',')
            const newitem = { ...item, document_lob: lob_name_str }
            setData((data) => [...data, newitem])

          }
        })
    }
  }

  const getDocuments = async (page, perPage) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Documents_Type?page=${page}&limit=${perPage}&lob=${lobtype}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const total = data.total
        const slice = total / perPage
        const pages = Math.ceil(slice)
        setPageCount(pages)
        const list = data.data
        setData(list)
        // const list_len = list.length

        // for (let i = 0; i < list_len; i++) {
        //   lobdata(list[i])
        // }
      })
  }
  console.log(data)

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getDocuments(selectedPage + 1, perPage);
  };

  const addDocument = async (e) => {
    try {
      if (documenttype?.length == 0) {
        swal({

          text: 'Please Enter Document Type',
          icon: 'warning',
        })
        return false
      }
      if (selectedOption?.length == 0) {
        swal({

          text: 'Please Select LOB',
          icon: 'warning',
        })
        return false
      }
      if (selectedOption?.value == '6418643bf42eaf5ba1c9e0ef') {
        if (selectedpolicyType?.length == 0) {
          swal({

            text: 'Please Select Policy Type',
            icon: 'warning',
          })
          return false
        }
        if (selectedvehicleBrandNew?.length == 0) {
          swal({

            text: 'Please Select Vehicle Brand New',
            icon: 'warning',
          })
          return false
        }
        if (selectedisCurrentYearPolicyStillValid?.length == 0) {
          swal({

            text: 'Please Select Is Current Year Policy Still Valid',
            icon: 'warning',
          })
          return false
        }
        if (selectedmortgage?.length == 0) {
          swal({

            text: 'Please Select Mortgage',
            icon: 'warning',
          })
          return false
        }
        if (selectedvehicleSpecification?.length == 0) {
          swal({

            text: 'Please Select Vehicle Specification',
            icon: 'warning',
          })
          return false
        }
        if (selectednumberOfYearsOfNoClaim?.length == 0) {
          swal({

            text: 'Please Select Number Of Years Of No Claim',
            icon: 'warning',
          })
          return false
        }
      }
      if (selectedOption?.value == '641bf214cbfce023c8c76762') {
        if (selectedVisa?.length == 0) {
          swal({

            text: 'Please Select Visa Type',
            icon: 'warning',
          })
          return false
        }
        // if (selectedExpiryDate?.length == 0) {
        //   swal({

        //     text: 'Please Select Expiry Date',
        //     icon: 'warning',
        //   })
        //   return false
        // }
      }
      if (showGMDocType == true && gmDocTypeValue == '') {
        swal({
          text: "Please Select Document Type",
          icon: 'warning',
        })
        return false
      }


      e.preventDefault()
      const document_lobs = selectedOption.value
      const document_location = selectedLocation?.map((val) => val.value)
      const policy_type = selectedpolicyType?.map((val) => val.value)
      const vehicle_brand_new = selectedvehicleBrandNew?.map((val) => val.value)
      const is_current_year_policy_still_valid = selectedisCurrentYearPolicyStillValid?.map((val) => val.value)
      const mortgage = selectedmortgage?.map((val) => val.value)
      const vehicle_specification = selectedvehicleSpecification?.map((val) => val.value)
      const number_of_years_of_no_claim = selectednumberOfYearsOfNoClaim?.map((val) => val.value)
      const visa_type = selectedVisa?.map((val) => val.value)
      const expiry_date = selectedExpiryDate
      let docCategory = []
      if (gmDocTypeValue == 'issued policy') {
        docCategory = selectedDocCategory
      }
      console.table([documenttype, document_location, document_lobs, policy_type, vehicle_brand_new, is_current_year_policy_still_valid, mortgage, vehicle_specification, number_of_years_of_no_claim])
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: documenttype,
          document_lob: document_lobs,
          document_location: document_location,
          policy_type: policy_type,
          vehicle_brand_new: vehicle_brand_new,
          is_current_year_policy_still_valid: is_current_year_policy_still_valid,
          mortgage: mortgage,
          vehicle_specification: vehicle_specification,
          number_of_years_of_no_claim: number_of_years_of_no_claim,
          visaType: visa_type,
          documentExpiryDate: expiry_date,
          medicalId: {
            level: numberlabel,
            placeHolder: numberplaceholder
          },
          medicaliSueDate: {
            level: IssueDatelabel,
            placeHolder: IssueDateplaceholder
          },
          medicalExpiryDate: {
            level: ExpiryDatelabel,
            placeHolder: ExpiryDateplaceholder
          },
          insurrerFor: insurer,
          group_medical_document_type: gmDocTypeValue,
          document_category: docCategory
        }),
      }
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/add_Documents_Type`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            swal({
              title: 'Success',
              text: 'Document Type Added Successfully',
              icon: 'success',
            })
          } else {
            swal({
              title: 'Error',
              text: 'Error',
              icon: 'error',

            })
          }
        })

      setShowModal(false)
      getDocuments(page, perPage)
    }
    catch (error) {
      console.log(error)
    }
  }

  const detailsbyid = async (ParamValue) => {
    setId(ParamValue)
    setDocument_Type('')
    setNewLob([])
    setNewSelectedLocation([])
    setNewPolicyType([])
    setNewVehicleBrandNew([])
    setNewIsCurrentYearPolicyStillValid([])
    setNewMortgage([])
    setNewVehicleSpecification([])
    setNewNumberOfYearsOfNoClaim([])
    setNewVisa([])
    setNewExpiryDate('')
    setNewNumberlabel('')
    setNewNumberplaceholder('')
    setNewIssuedatelabel('')
    setNewIssuedateplaceholder('')
    setNewExpirydatelabel('')
    setNewExpirydateplaceholder('')
    setNewInsurer(false)
    setShowDocCategory(false)
    setGMDocTypeField(false)
    setGMDocTypeFieldEdit(false)

    const requestOptions = {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Documents_Type_byid`, requestOptions)
    result = await result.json()

    const documentdata = result.data[0]
    console.log(documentdata, "asdfsdfsdff data")
    if (documentdata?.group_medical_document_type == 'issued policy') {
      // alert('inside if')
      const catData = documentdata?.document_category?.map((item) => ({
        label: item?.category_name,
        value: item._id
      }))
      setSelectedDocCategory(catData)
      setGMDocTypeFieldEdit(true)
      setShowDocCategory(true)
    }
    if (documentdata?.document_lob[0]?._id == '658bf04ed4c9b13ffb6ddb8a') {
      setGMDocTypeFieldEdit(true)
    }
    console.log(documentdata, "documentdata")
    setDocumentType(documentdata?.document_type)
    setLobById(documentdata?.document_lob[0]?._id)
    const lobid = documentdata?.document_lob?.map((val) => ({
      label: val.line_of_business_name, value: val._id
    }))

    setSelectedOption(lobid)
    const policyType = documentdata?.policy_type?.map((val) => ({
      label: val.policy_type_name, value: val._id
    }))
    setSelectedLocation(documentdata?.document_location?.map((val) => ({
      label: val.location_name, value: val._id
    }))
    )
    setSelectedPolicyType(policyType)
    const vehicleBrandNew = documentdata?.vehicle_brand_new?.map((val) => ({
      label: val == 'true' ? "YES" : "NO", value: val
    }))
    setSelectedVehicleBrandNew(vehicleBrandNew)
    const isCurrentYearPolicyStillValid = documentdata?.is_current_year_policy_still_valid?.map((val) => ({
      label: val == 'true' ? "YES" : "NO", value: val
    }))
    setSelectedIsCurrentYearPolicyStillValid(isCurrentYearPolicyStillValid)
    const mortgage = documentdata?.mortgage?.map((val) => ({
      label: val == 'true' ? "YES" : "NO", value: val
    }))
    setSelectedMortgage(mortgage)
    const vehicleSpecification = documentdata?.vehicle_specification?.map((val) => ({
      label: val.plan_for_gcc_spec_name, value: val._id
    }))
    setSelectedVehicleSpecification(vehicleSpecification)
    const numberOfYearsOfNoClaim = documentdata?.number_of_years_of_no_claim?.map((val) => ({
      label: val?.toString(), value: val
    }))
    setSelectedNumberOfYearsOfNoClaim(numberOfYearsOfNoClaim)
    const visa = documentdata?.visaType?.map((val) => ({
      label: val.medical_plan_condition, value: val._id
    }))
    setSelectedVisa(visa)
    setSelectedExpiryDate(documentdata?.documentExpiryDate)

    setNumberlabel(documentdata?.medicalId?.level)
    setNumberplaceholder(documentdata?.medicalId?.placeHolder)
    setIssuedatelabel(documentdata?.medicaliSueDate?.level)
    setIssuedateplaceholder(documentdata?.medicaliSueDate?.placeHolder)
    setExpirydatelabel(documentdata?.medicalExpiryDate?.level)
    setExpirydateplaceholder(documentdata?.medicalExpiryDate?.placeHolder)
    setGMDocTypeValue(documentdata?.group_medical_document_type)
    setInsurer(documentdata?.insurrerFor)


    setVisible(true)

  }

  console.log(selectedvehicleBrandNew, 'selectedvehicleBrandNew')
  console.log(selectedVisa, 'selectedVisa')
  console.log(newVisa, 'newVisa')
  const updateDocument = async (e) => {
    e.preventDefault()

    try {
      let docCategory = []
      if (gmDocTypeValue == 'issued policy') {
        docCategory = selectedDocCategory
      }
      if (!document_type?.length && !documenttype?.length) {
        swal({
          text: 'Please Enter Document Type',
          icon: 'warning',
        })
        return false
      }
      if (!newlob?.length && !selectedOption?.length) {
        swal({
          text: 'Please Select LOB',
          icon: 'warning',
        })
        return false
      }
      if (newlob?.value == '6418643bf42eaf5ba1c9e0ef' || selectedOption?.value == '6418643bf42eaf5ba1c9e0ef') {
        if (!newpolicyType?.length && !selectedpolicyType?.length) {
          swal({
            text: 'Please Select Policy Type',
            icon: 'warning',
          })
          return false
        }
        if (!newvehicleBrandNew?.length && !selectedvehicleBrandNew?.length) {
          swal({
            text: 'Please Select Vehicle Brand New',
            icon: 'warning',
          })
          return false
        }
        if (!newisCurrentYearPolicyStillValid?.length && !selectedisCurrentYearPolicyStillValid?.length) {
          swal({
            text: 'Please Select Is Current Year Policy Still Valid',
            icon: 'warning',
          })
          return false
        }
        if (!newmortgage?.length && !selectedmortgage?.length) {
          swal({
            text: 'Please Select Mortgage',
            icon: 'warning',
          })
          return false
        }
        if (!newvehicleSpecification?.length && !selectedvehicleSpecification?.length) {
          swal({
            text: 'Please Select Vehicle Specification',
            icon: 'warning',
          })
          return false
        }
        if (!newnumberOfYearsOfNoClaim?.length && !selectednumberOfYearsOfNoClaim?.length) {
          swal({
            text: 'Please Select Number Of Years Of No Claim',
            icon: 'warning',
          })
          return false
        }
      }
      if (newlob?.value == '641bf214cbfce023c8c76762' || selectedOption?.value == '641bf214cbfce023c8c76762') {
        if (!newVisa?.length && !selectedVisa?.length) {
          swal({
            text: 'Please Select Visa Type',
            icon: 'warning',
          })
          return false
        }
        // if (!newExpiryDate?.length && !selectedExpiryDate?.length) {
        //   swal({
        //     text: 'Please Select Expiry Date',
        //     icon: 'warning',
        //   })
        //   return false
        // }
      }
      //       if (newnumberlabel == ''){
      //         setNewNumberplaceholder('')
      // }
      //       if(newIssueDatelabel ==''){
      //         setNewIssuedateplaceholder('')
      // }
      // if(newExpiryDatelabel ==''){
      //   setNewExpirydateplaceholder('')
      // }



      const editeddocumenttypess = document_type == '' || undefined || null ? documenttype : document_type

      const editeddocument_lobs = newlob == '' || undefined || null ? selectedOption?.map((val) => val.value) : newlob.value

      const editedlocation = newSelectedLocation == '' || undefined || null ? selectedLocation?.map((val) => val.value) : newSelectedLocation?.map((val) => val.value)

      const editedpolicy_type = !newpolicyType || !newpolicyType.length ? selectedpolicyType?.map((val) => val.value) : newpolicyType?.map((val) => val.value)

      const editedvehicle_brand_new = !newvehicleBrandNew || !newvehicleBrandNew.length ? selectedvehicleBrandNew?.map((val) => val.value) : newvehicleBrandNew?.map((val) => val.value)

      const editedis_current_year_policy_still_valid = !newisCurrentYearPolicyStillValid || !newisCurrentYearPolicyStillValid.length ? selectedisCurrentYearPolicyStillValid?.map((val) => val.value) : newisCurrentYearPolicyStillValid?.map((val) => val.value)

      const editedmortgage = !newmortgage || !newmortgage.length ? selectedmortgage?.map((val) => val.value) : newmortgage?.map((val) => val.value)

      const editedvehicle_specification = !newvehicleSpecification || !newvehicleSpecification.length ? selectedvehicleSpecification?.map((val) => val.value) : newvehicleSpecification?.map((val) => val.value)

      const editednumber_of_years_of_no_claim = !newnumberOfYearsOfNoClaim || !newnumberOfYearsOfNoClaim.length ? selectednumberOfYearsOfNoClaim?.map((val) => val.value) : newnumberOfYearsOfNoClaim?.map((val) => val.value)

      const editedvisa = newVisa == '' || undefined || null ? selectedVisa?.map((val) => val.value) : newVisa?.map((val) => val.value)

      const editedexpiry_date = !newExpiryDate || newExpiryDate.length == 0 ? selectedExpiryDate : newExpiryDate

      const editednumberlabel = newnumberlabel

      const editednumberplaceholder = newnumberplaceholder

      const editedIssueDatelabel = newIssueDatelabel

      const editedIssueDateplaceholder = newIssueDateplaceholder

      const editedExpiryDatelabel = newExpiryDatelabel

      const editedExpiryDateplaceholder = newExpiryDateplaceholder

      const editedInsurer = newInsurer

      console.table(
        [
          editeddocumenttypess,
          editeddocument_lobs,
          editedlocation,
          editedpolicy_type,
          editedvehicle_brand_new,
          editedis_current_year_policy_still_valid,
          editedmortgage,
          editedvehicle_specification,
          editednumber_of_years_of_no_claim,
          editedvisa,
          editedexpiry_date
        ])
      console.log("Edited Form Data Before Sending Request:");
      console.log("Edited Document Type:", editeddocumenttypess);
      console.log("Edited LOB:", editeddocument_lobs);
      console.log("Edited Policy Type:", editedpolicy_type);
      console.log("Edited Vehicle Brand New:", editedvehicle_brand_new);
      console.log("Edited Is Current Year Policy Still Valid:", editedis_current_year_policy_still_valid);
      console.log("Edited Mortgage:", editedmortgage);
      console.log("Edited Vehicle Specification:", editedvehicle_specification);
      console.log("Edited Number Of Years Of No Claim:", editednumber_of_years_of_no_claim);
      console.log("Edited Visa:", editedvisa);
      console.log("Edited Expiry Date:", editedexpiry_date);
      // return false;




      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: editeddocumenttypess,
          document_lob: editeddocument_lobs.toString(),
          document_location: editedlocation,
          policy_type: editedpolicy_type,
          vehicle_brand_new: editedvehicle_brand_new,
          is_current_year_policy_still_valid: editedis_current_year_policy_still_valid,
          mortgage: editedmortgage,
          vehicle_specification: editedvehicle_specification,
          number_of_years_of_no_claim: editednumber_of_years_of_no_claim,
          visaType: editedvisa,
          documentExpiryDate: editedexpiry_date,
          medicalId: {
            level: numberlabel,
            placeHolder: numberplaceholder
          },
          medicaliSueDate: {
            level: IssueDatelabel,
            placeHolder: IssueDateplaceholder
          },
          medicalExpiryDate: {
            level: ExpiryDatelabel,
            placeHolder: ExpiryDateplaceholder
          },
          insurrerFor: insurer,
          ParamValue: id,
          group_medical_document_type: gmDocTypeValue,
          document_category: docCategory
        }),
      }
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_Documents_Type`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            swal({
              title: 'Success',
              text: 'Document Type Updated Successfully',
              icon: 'success',
            })
          } else {
            swal({
              title: 'Error',
              text: 'Error',
              icon: 'error',
            })
          }
        })
      setVisible(false)
      getDocuments(page, perPage)

    }
    catch (error) {
      console.log(error)
    }
  }

  const startFrom = (page - 1) * perPage;

  const booldata = [
    { label: 'YES', value: 'true' },
    { label: 'NO', value: 'false' }
  ]

  const years = [
    { label: 'None', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
  ]

  const handleModal = () => {
    setSelectedOption([])
    setSelectedPolicyType([])
    setSelectedVehicleBrandNew([])
    setSelectedIsCurrentYearPolicyStillValid([])
    setSelectedMortgage([])
    setSelectedVehicleSpecification([])
    setSelectedNumberOfYearsOfNoClaim([])
    setDocumentType('')
    setSelectedVisa([])
    setSelectedExpiryDate('')
    setNewVisa([])
    setNewExpiryDate('')
    setNumberlabel('')
    setNumberplaceholder('')
    setIssuedatelabel('')
    setIssuedateplaceholder('')
    setExpirydatelabel('')
    setExpirydateplaceholder('')
    setInsurer(false)
    setShowDocCategory(false)
    setShowModal(true)
  }

  const updatestatus = (id, status) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/update_document_status/${id}/${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getDocuments(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);

        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: "Ok",
          }).then(() => {
            getDocuments(page, perPage);
          });
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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData?id=${id}&type=documents_type`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getDocuments(page, perPage)
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
          getDocuments(page, perPage)
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }


  const getGroupMedicalCategories = () => {
    const reqOption = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalCategory`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          console.log("Category Data : ", data.data)
          const catData = data.data
          const stateData = catData.map((item) => (
            {
              label: item.category_name,
              value: item._id
            }))
          setGroupMedicalCategory(stateData)
          setSelectedDocCategory(stateData)
        }

      })
  }
  const handleChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const GMDocChangeHandler = (e) => {
    setGMDocTypeValue(e.target.value)
    if (e.target.value == 'issued policy') {
      setShowDocCategory(true)
    } else {
      setShowDocCategory(false)
    }
  }



  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Document Type Details</h4>
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-primary"
                  style={{ float: 'right' }}
                  onClick={() => handleModal()}
                >
                  Add Document Type
                </button>
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {/* <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a> */}
            {/* <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button> */}
            {/* <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button> */}
          </div>
          <div className="card-body">
            <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
              <div className='col-md-2'>
                <label className="form-label">
                  <strong>Line Of Business</strong>
                </label>
                <select className='form-control'

                  onChange={(e) => setLobType(e.target.value)}
                >
                  <option value={''}>-- All --</option>
                  {
                    lob?.map((val, index) => {
                      return (
                        <option key={index} value={val.value}>{val.label}</option>
                      )
                    }
                    )
                  }
                </select>
              </div>
            </div>
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Document Type</th>
                  <th scope="col">Document LOB</th>
                  <th scope="col">Document Location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data?.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item?.document_type}</td>
                      <td>{item?.document_lob?.map((val) => val?.line_of_business_name)?.join(", ")}</td>
                      <td>{item?.document_location?.map((val) => val?.location_name)?.join(", ")}</td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => detailsbyid(item?._id)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        {' '}
                        {
                          item.status == 1 ?
                            <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item?._id, 0) }}> Deactivate</button>
                            :
                            <button className="btn btn-success btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item?._id, 1) }}> Activate</button>
                        }
                        {' '}
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deleteItem(item?._id) }}
                        >
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={1}
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
      <Modal size="lg" className='datedate' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Document Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            <strong>Add Document Type</strong>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="document_type"
                            placeholder="Enter Document Type"
                            defaultValue=""
                            required
                            onChange={(e) => setDocumentType(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            <strong>Select LOB</strong>
                          </label>

                          <Select
                            options={lob}
                            defaultValue={selectedOption}
                            onChange={setSelectedOption}

                          />
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            <strong>Select Location</strong>
                          </label>

                          <Multiselect
                            options={location}
                            selectedValues={location}
                            onSelect={setSelectedLocation}
                            onRemove={setSelectedLocation}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                          />
                        </div>
                        {showGMDocType == true ?
                          <div className='col-md-6 mb-2'>
                            <label className="form-label">
                              <strong>Select Group Medical Document Type</strong>
                            </label>
                            <select
                              className='form-control'
                              onChange={(e) => GMDocChangeHandler(e)}
                            >
                              <option value=''>Select Document Type</option>
                              <option value='new'>New</option>
                              <option value='claim'>Claim</option>
                              <option value='deleted'>Deleted</option>
                              <option value='issued policy'>Issued Policy</option>
                            </select>

                          </div> : ""}
                        {gmDocTypeValue == 'issued policy' && showDocCategory == true ?
                          <div className='col-md-6'>
                            <label className='form-label'><strong>Select Document Category</strong></label>
                            <Multiselect
                              options={groupMedicalCategories}
                              selectedValues={groupMedicalCategories}
                              onSelect={setSelectedDocCategory}
                              onRemove={setSelectedDocCategory}
                              displayValue="label"
                              placeholder="Select Document Category"
                              closeOnSelect={false}
                              avoidHighlightFirstOption={true}
                              showCheckbox={true}
                              style={{ chips: { background: "#007bff" } }}
                              required
                            />

                          </div> : ''
                        }
                        {selectedOption?.value == '6418643bf42eaf5ba1c9e0ef' ?
                          <>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Select Policy type</strong>
                              </label>

                              <Multiselect
                                options={policyType}
                                displayValue="label"
                                onSelect={setSelectedPolicyType}
                                onRemove={setSelectedPolicyType}
                                placeholder="Select"
                                showCheckbox={true}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Vehicle Brand New</strong>
                              </label>

                              <Multiselect
                                options={booldata}
                                displayValue="label"
                                onSelect={setSelectedVehicleBrandNew}
                                onRemove={setSelectedVehicleBrandNew}
                                placeholder="Select"
                                showCheckbox={true}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Is Current year Policy Still Valid</strong>
                              </label>

                              <Multiselect
                                options={booldata}
                                displayValue="label"
                                onSelect={setSelectedIsCurrentYearPolicyStillValid}
                                onRemove={setSelectedIsCurrentYearPolicyStillValid}
                                placeholder="Select"
                                showCheckbox={true}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Mortgage</strong>
                              </label>

                              <Multiselect
                                options={booldata}
                                displayValue="label"
                                onSelect={setSelectedMortgage}
                                onRemove={setSelectedMortgage}
                                placeholder="Select"
                                showCheckbox={true}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Vehicle specification</strong>
                              </label>

                              <Multiselect
                                options={gccspec}
                                displayValue="label"
                                onSelect={setSelectedVehicleSpecification}
                                onRemove={setSelectedVehicleSpecification}
                                placeholder="Select"
                                showCheckbox={true}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Number Of Years of No Claim</strong>
                              </label>

                              <Multiselect
                                options={years}
                                displayValue="label"
                                onSelect={setSelectedNumberOfYearsOfNoClaim}
                                onRemove={setSelectedNumberOfYearsOfNoClaim}
                                placeholder="Select"
                                showCheckbox={true}
                                required
                              />
                            </div>
                          </>
                          :
                          selectedOption?.value == '641bf214cbfce023c8c76762' ?
                            <>
                              <div className="col-md-6 mb-2">
                                <label className="form-label">
                                  <strong>Visa Type</strong>
                                </label>
                                {/* <Select
                            options={visa}
                            defaultValue={selectedVisa}
                            onChange={setSelectedVisa}
                          /> */}
                                <Multiselect
                                  options={visa}
                                  displayValue="label"
                                  onSelect={setSelectedVisa}
                                  onRemove={setSelectedVisa}
                                  placeholder="Select"
                                  showCheckbox={true}
                                  required
                                />
                              </div>
                              {/* <div className="col-md-6 mb-2">
                                <label className="form-label">
                                  <strong>Expiry Date</strong>
                                </label>

                                <DatePicker

                                  className='form-control'
                                  placeholderText="Expiry Date"
                                  dateFormat="dd/MM/yyyy"
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  showTimeSelect={false}
                                  minDate={new Date()}
                                  selected={selectedExpiryDate}
                                  onChange={(date) => setSelectedExpiryDate(date)}
                                  onKeyDown={(e) => e.preventDefault()}
                                />

                              </div> */}
                              <div className="col-md-6 mb-2">
                                <label className="form-label">
                                  <strong>Document For</strong>
                                </label>

                                <select className='form-control' onChange={(e) => setInsurer(e.target.value)}>
                                  <option value={''} hidden>--Select--</option>
                                  <option value={true}>Insurer</option>
                                  <option value={false}>Sponsor</option>
                                </select>
                              </div>

                            </>
                            :
                            null
                        }
                        {selectedOption?.value == '641bf214cbfce023c8c76762' ?
                          <>
                            <div className="col-md-12 mb-2">
                              <label className="form-label">
                                <strong>Number</strong>
                              </label>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Label"
                                    defaultValue=""
                                    required
                                    onChange={(e) => setNumberlabel(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Placeholder"
                                    defaultValue=""
                                    required
                                    onChange={(e) => setNumberplaceholder(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12 mb-2">
                              <label className="form-label">
                                <strong>Issue Date</strong>
                              </label>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Label"
                                    defaultValue=""
                                    required
                                    onChange={(e) => setIssuedatelabel(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Placeholder"
                                    defaultValue=""
                                    required
                                    onChange={(e) => setIssuedateplaceholder(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12 mb-2">
                              <label className="form-label">
                                <strong>Expiry Date</strong>
                              </label>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Label"
                                    defaultValue=""
                                    required
                                    onChange={(e) => setExpirydatelabel(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Placeholder"
                                    defaultValue=""
                                    required
                                    onChange={(e) => setExpirydateplaceholder(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                          </>
                          :
                          null
                        }



                      </div>







                      {/* <div className="row">
                        <div className="col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary mt-2 submit_all"
                            style={{ float: 'right' }}
                          >
                            Submit
                          </button>
                        </div>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" onClick={addDocument}>
            Submit
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" className='datedate' show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            <strong>Edit Document Type</strong>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="document_type"
                            placeholder="Reason"
                            defaultValue={documenttype}
                            required
                            onChange={(e) => setDocument_Type(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            <strong>Select LOB</strong>
                          </label>
                          <Select
                            options={lob}
                            defaultValue={selectedOption}
                            onChange={(data) => setNewLob(data)}
                          />
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            <strong>Select Location</strong>
                          </label>
                          <Multiselect
                            options={location}
                            selectedValues={selectedLocation}
                            onSelect={(data) => setNewSelectedLocation(data)}
                            onRemove={(data) => setNewSelectedLocation(data)}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                          />
                        </div>
                        {showGMDocTypeEdit == true ?
                          <div className='col-md-6'>
                            <label className="form-label">
                              <strong>Group Medical Document Type</strong>
                            </label>
                            <select
                              className='form-control'
                              defaultValue={gmDocTypeValue}
                              onChange={(e) => GMDocChangeHandler(e)}
                            >
                              <option value=''>Select Document Type</option>
                              <option value='new'>New</option>
                              <option value='claim'>Claim</option>
                              <option value='deleted'>Deleted</option>
                              <option value='issued policy'>Issued Policy</option>
                            </select>

                          </div>
                          : " "}
                        {gmDocTypeValue == "issued policy" ?
                          <div className='col-md-6'>
                            <label className='form-label'><strong>Select Document Category</strong></label>
                            <Multiselect
                              options={groupMedicalCategories}
                              selectedValues={selectedDocCategory}
                              onSelect={setSelectedDocCategory}
                              onRemove={setSelectedDocCategory}
                              displayValue="label"
                              placeholder="Select Document Category"
                              closeOnSelect={false}
                              avoidHighlightFirstOption={true}
                              showCheckbox={true}
                              style={{ chips: { background: "#007bff" } }}
                              required
                            />

                          </div> : ''
                        }
                        {lobbyid == '6418643bf42eaf5ba1c9e0ef' || selectedOption?.value == '6418643bf42eaf5ba1c9e0ef' || newlob?.value == '6418643bf42eaf5ba1c9e0ef' ?
                          <>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Select Policy type</strong>
                              </label>
                              <Multiselect
                                options={policyType}
                                selectedValues={selectedpolicyType}
                                onSelect={(data) => setNewPolicyType(data)}
                                onRemove={(data) => setNewPolicyType(data)}
                                displayValue="label"
                                placeholder="Select Location"
                                closeOnSelect={false}
                                avoidHighlightFirstOption={true}
                                showCheckbox={true}
                                style={{ chips: { background: '#007bff' } }}
                                required
                              />
                            </div>

                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Vehicle Brand New</strong>
                              </label>
                              <Multiselect
                                options={booldata}
                                selectedValues={selectedvehicleBrandNew}
                                onSelect={(data) => setNewVehicleBrandNew(data)}
                                onRemove={(data) => setNewVehicleBrandNew(data)}
                                displayValue="label"
                                placeholder="Select Location"
                                closeOnSelect={false}
                                avoidHighlightFirstOption={true}
                                showCheckbox={true}
                                style={{ chips: { background: '#007bff' } }}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Is Current year Policy Still Valid</strong>
                              </label>
                              <Multiselect
                                options={booldata}
                                selectedValues={selectedisCurrentYearPolicyStillValid}
                                onSelect={(data) => setNewIsCurrentYearPolicyStillValid(data)}
                                onRemove={(data) => setNewIsCurrentYearPolicyStillValid(data)}
                                displayValue="label"
                                placeholder="Select Location"
                                closeOnSelect={false}
                                avoidHighlightFirstOption={true}
                                showCheckbox={true}
                                style={{ chips: { background: '#007bff' } }}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Mortgage</strong>
                              </label>
                              <Multiselect
                                options={booldata}
                                selectedValues={selectedmortgage}
                                onSelect={(data) => setNewMortgage(data)}
                                onRemove={(data) => setNewMortgage(data)}
                                displayValue="label"
                                placeholder="Select Location"
                                closeOnSelect={false}
                                avoidHighlightFirstOption={true}
                                showCheckbox={true}
                                style={{ chips: { background: '#007bff' } }}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Vehicle specification</strong>
                              </label>
                              <Multiselect
                                options={gccspec}
                                selectedValues={selectedvehicleSpecification}
                                onSelect={(data) => setNewVehicleSpecification(data)}
                                onRemove={(data) => setNewVehicleSpecification(data)}
                                displayValue="label"
                                placeholder="Select Location"
                                closeOnSelect={false}
                                avoidHighlightFirstOption={true}
                                showCheckbox={true}
                                style={{ chips: { background: '#007bff' } }}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <label className="form-label">
                                <strong>Vehicle specification</strong>
                              </label>
                              <Multiselect
                                options={years}
                                selectedValues={selectednumberOfYearsOfNoClaim}
                                onSelect={(data) => setNewNumberOfYearsOfNoClaim(data)}
                                onRemove={(data) => setNewNumberOfYearsOfNoClaim(data)}
                                displayValue="label"
                                placeholder="Select Location"
                                closeOnSelect={false}
                                avoidHighlightFirstOption={true}
                                showCheckbox={true}
                                style={{ chips: { background: '#007bff' } }}
                                required
                              />
                            </div>
                          </>
                          :
                          lobbyid == '641bf214cbfce023c8c76762' || selectedOption?.value == '641bf214cbfce023c8c76762' || newlob?.value == '641bf214cbfce023c8c76762' ?
                            <>
                              <div className="col-md-6 mb-2">
                                <label className="form-label">
                                  <strong>Visa Type</strong>
                                </label>
                                {/* <Select
                            options={visa}
                            defaultValue={selectedVisa}
                            onChange={(data)=>setNewVisa(data)}
                          
                          /> */}
                                <Multiselect
                                  options={visa}
                                  selectedValues={selectedVisa}
                                  onSelect={(data) => setNewVisa(data)}
                                  onRemove={(data) => setNewVisa(data)}
                                  displayValue="label"
                                  placeholder="Select Location"
                                  closeOnSelect={false}
                                  avoidHighlightFirstOption={true}
                                  showCheckbox={true}
                                  style={{ chips: { background: '#007bff' } }}
                                  required
                                />
                              </div>
                              {/* <div className="col-md-6 mb-2">
                                <label className="form-label">
                                  <strong>Expiry Date</strong>
                                </label>
                                <DatePicker
                                  className='form-control'
                                  placeholderText="Expiry Date"
                                  dateFormat="dd/MM/yyyy"
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  showTimeSelect={false}
                                  minDate={new Date()}
                                  selected={
                                    selectedExpiryDate
                                      ? new Date(newExpiryDate != '' ? newExpiryDate : selectedExpiryDate)
                                      : null
                                  }
                                  onChange={(date) => setNewExpiryDate(date)}
                                  onKeyDown={(e) => e.preventDefault()}
                                />
                              </div> */}
                              <div className="col-md-6 mb-2">
                                <label className="form-label">
                                  <strong>Document For</strong>
                                </label>
                                <select className='form-control'
                                  defaultValue={insurer}
                                  onChange={(e) => setInsurer(e.target.value)}>
                                  <option value={''} hidden>--Select--</option>
                                  <option value={true}>Insurer</option>
                                  <option value={false}>Sponsor</option>
                                </select>
                              </div>
                            </>
                            :
                            null
                        }
                        {lobbyid == '641bf214cbfce023c8c76762' || selectedOption?.value == '641bf214cbfce023c8c76762' || newlob?.value == '641bf214cbfce023c8c76762' ?
                          <>
                            <div className="col-md-12 mb-2">
                              <label className="form-label">
                                <strong>Number</strong>
                              </label>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Label"
                                    defaultValue={numberlabel}
                                    required
                                    onChange={(e) => setNumberlabel(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Placeholder"
                                    defaultValue={numberplaceholder}
                                    required
                                    onChange={(e) => setNumberplaceholder(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12 mb-2">
                              <label className="form-label">
                                <strong>Issue Date</strong>
                              </label>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Label"
                                    defaultValue={IssueDatelabel}
                                    required
                                    onChange={(e) => setIssuedatelabel(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Placeholder"
                                    defaultValue={IssueDateplaceholder}
                                    required
                                    onChange={(e) => setIssuedateplaceholder(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12 mb-2">
                              <label className="form-label">
                                <strong>Expiry Date</strong>
                              </label>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Label"
                                    defaultValue={ExpiryDatelabel}
                                    required
                                    onChange={(e) => setExpirydatelabel(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="document_type"
                                    placeholder="Enter Placeholder"
                                    defaultValue={ExpiryDateplaceholder}
                                    required
                                    onChange={(e) => setExpirydateplaceholder(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                          </>
                          :
                          null
                        }

                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" onClick={updateDocument}>
            Submit
          </Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewDocumentsList
