import React, { useEffect, useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Box
} from '@chakra-ui/react';
import { dateFormat } from '../../utils/dateFormat';
import axios from 'axios';

const WalletSection = ({id}) => {
  const [profileWallet, setProfileWallet] = useState([]);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/profile/wallate/6683f17634828915a0d89579',
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      setProfileWallet(response.data.allWallate);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [id]);

  return (
    <Box className='profile_other_section'>
        <Box className="section_header">Profile wallet</Box>
        <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th className='profile_table_header'>SL</Th>
                            <Th className='profile_table_header'>Question</Th>
                            <Th className='profile_table_header'>Amount</Th>
                            <Th className='profile_table_header'>Time</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            (profileWallet || []).length > 0 ? <>
                            {
                                profileWallet.map((data, index) => (
                                    <Tr key={data._id}>
                                        <Td className='td'>{index+1}</Td>
                                        <Td className='td'>{data.questionId.question}</Td>
                                        <Td className='td'>{data.amount}</Td>
                                        <Td className='td'>{dateFormat(data.questionId.createdAt)}</Td>
                                    </Tr>
                                ))
                            }
                            </> : 
                            <Tr className='empty_table_row'>
                                <Td className='empty_table_row' colSpan='3'>
                                    <Box className='empty_table_list'>
                                        No data found
                                    </Box>
                                </Td>
                            </Tr>
                        } 
                    </Tbody>
                </Table>
            </TableContainer>
    </Box>
  )
}

export default WalletSection