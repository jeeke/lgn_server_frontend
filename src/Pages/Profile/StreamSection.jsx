import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const StreamSection = ({id}) => {
    const [profileStreams, setProfileStreams] = useState([]);

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/tournament/by-userid/${id}`,
            headers: { }
        };
        axios.request(config)
        .then((response) => {
            setProfileStreams(response.data.tournamentList);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [id])
    return (
        <Box className='profile_other_section'>
            <Box className="section_header">Profile streams</Box>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th className='profile_table_header'>SL</Th>
                            <Th className='profile_table_header'>Title</Th>
                            <Th className='profile_table_header'>Time</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            (profileStreams || []).length > 0 ? <>
                            {
                                profileStreams.map((data, index) => (
                                    <Tr key={data._id}>
                                        <Td className='td'>{index+1}</Td>
                                        <Td className='td'>{data.title}</Td>
                                        <Td className='td'>{dateFormat(data.createdAt)}</Td>
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

export default StreamSection