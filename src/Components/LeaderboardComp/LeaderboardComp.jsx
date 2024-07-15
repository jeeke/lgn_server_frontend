import React from 'react';
import {
    Box,
    Button,
    Input,
    Image,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableCaption,
    TableContainer,
    Td,
    Spinner,
} from "@chakra-ui/react";

const LeaderboardComp = ({data, index}) => {
  return (
    <>
    <Tr>
        <Td className='td'>{index}</Td>
        {
          data.userId && 
          <Td className='td'>{data.userId.name}</Td>
        }
        <Td className='td notification_decription'>{data.points}</Td>
    </Tr>
    </>
  )
}

export default LeaderboardComp