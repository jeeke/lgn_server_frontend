import React from 'react';
import {
    Tr,
    Td,
} from "@chakra-ui/react";

const LeaderboardComp = ({data, index}) => {
  return (
    <>
    {
      data.userId &&
      <Tr>
        <Td className='td'>{index}</Td>
        {
          data.userId && 
          <Td className='td'>{data.userId.name}</Td>
        }
        <Td className='td notification_decription'>{data.points}</Td>
    </Tr>
    }
    </>
  )
}

export default LeaderboardComp