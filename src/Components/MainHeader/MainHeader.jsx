import React,{useState, useEffect, useRef} from 'react'
import "./MainHeader.css"
import { Box, Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button, Img
} from '@chakra-ui/react';
import Logo from "../../Assets/lgn_logo.png";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import {GlobalContext} from "../../Context/Context";
import { MdOutlineNotificationsActive } from "react-icons/md";
import axios from "axios";
import Loader from '../Loader/Loader';
import MenuNotification from '../NotificationComp/MenuNotification';
import Pusher from 'pusher-js';

const MainHeader = () => {
  const navigate = useNavigate();
  const {notificationsCount,notifications, setNotifications} = GlobalContext();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = useState(false);
  const [count, setCount] = useState(10);
  // const divRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login")
  }

  useEffect(() => {
    if(openNotificationMenu) {
      if(page === 1) {
        setLoading(true);
      }
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/profile/admin-notification?page=${page}&limit=${limit}`,
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(response.data)
        setCount(response.data.notifictions.length)
        if(page === 1) {
          setNotifications(response.data.notifictions)
        } else {
          setNotifications(prev => [...prev, ...response.data.notifictions])
        }
        setLoading(false);
        setPaginationLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [page, openNotificationMenu]);

  /* PUSHER CODE IMPLEMENTATION */
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
      useTLS: true
    });

    const channel = pusher.subscribe('admin-channel');
    channel.bind('admin-notification', function(data) {
      console.log('Received admin notification:', data);
      // Handle the notification data as needed
    });

    return () => {
      channel.unbind(); // Unbind event listeners when component unmounts
      pusher.unsubscribe('admin-channel'); // Unsubscribe from channel
    };
  }, []);

  return (
    <Box className='main_header'>
      {/* Title */}
      <Box className='app_details_info'>
        <Img src={Logo} className='header_logo' />
        <Box className="app_title">LGN Dashboard</Box>
      </Box>

      <Box className='notification_button' onClick={() => setOpenNotificationMenu(p => !p)}>
        <MdOutlineNotificationsActive />
        {
          notificationsCount> 0 && <span className="notification_indicator"></span>
        }
      </Box>
      {
        openNotificationMenu && 
        <Box className={openNotificationMenu ? 'notification_menu show' : 'notification_menu'}>
          {/* Header */}
          <Box className="notification_header">Notifications</Box>
          <Box className='notification_section'>
            {
              loading ? 
              <Box className="menu_lader">
                <span className="loader1"></span>
              </Box> : 
              <Box className='menu_noti_section'>
                {(notifications || []).length > 0 ? 
                <>{notifications.map(data => (
                  <MenuNotification data={data} key={data._id} />
                ))}
                </> : 
              <Box className="empty_menu_notification">No notification found</Box>}
              </Box>
            }
          </Box>
        </Box>
      }
      <Button className='header_logout_btn' onClick={handleLogout}>
        <MdLogout />
      </Button>
    </Box>
  )
}

export default MainHeader;