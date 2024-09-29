import React from 'react';
import { useState, useEffect } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilUser,
  cilLowVision,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [profileimg, setProfileImg] = useState([]);
  const [profileName, setProfileName] = useState([]);
  const [usertype, setUsertype] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    else {
      const userdata = JSON.parse(localStorage.getItem('user'));
      const usertype = userdata.usertype;
      usertypedetail(usertype);
      setProfileName(userdata.name);
      if (userdata.profile_image == null || userdata.profile_image == undefined || userdata.profile_image == '') {
        setProfileImg(avatar8);
      }
      else {
        const image = userdata.profile_image[0]['filename'];
        if (image == undefined || image == null || image == '') {
          setProfileImg(avatar8);
        }
        else {
          const profileimg = "https://insuranceapi-3o5t.onrender.com/user_profile/" + userdata.profile_image[0]['filename'];
          setProfileImg(profileimg);
        }
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const usertypedetail = async (ParamValue) => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_user_type_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setUsertype(result?.data?.usertype);
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={profileimg} size="md" /><span style={{ fontSize: '14px', marginLeft: '10px', fontWeight: '700', position: 'relative', top: '16px', fontSize: '14px', marginLeft: '10px', fontWeight: '700', position: 'relative', top: '13px', display: 'inline-block' }}>{profileName}<p style={{ fontSize: '13px', fontWeight: '700' }}>{usertype}</p></span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="/ViewProfile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="/ChangePassWord">
          <CIcon icon={cilLowVision} className="me-2" />
          Change Password
        </CDropdownItem>
        <CDropdownItem href="#" onClick={logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
