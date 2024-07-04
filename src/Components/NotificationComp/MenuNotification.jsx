import React from 'react';

import { Box, Avatar } from '@chakra-ui/react';
import notificationType from "../../Config/notification";
import timeDifference from "../../utils/getTime";

const MenuNotification = ({data}) => {
  return (
    <Box className='menu_notification_card'>
        <Avatar src="" className='notification_avatar' />
        <Box className="notification_box">
            <span className="menu_noti_user_name">{data.user ? data.user.name : ""}</span>
            <span className="menu_notification_message">{notificationType[data.type] || ""}</span>
            <Box className="menu_notification_time">{timeDifference(new Date(), new Date(data.createdAt))}</Box>
        </Box>
    </Box>
  )
}

export default MenuNotification