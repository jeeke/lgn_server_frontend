import React from 'react';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableCaption,
    TableContainer,
    Input,
    Image,
    Img,
    Td,
    Spinner,
} from "@chakra-ui/react";
import TournamentsComp from "../../Components/TournamentsComp/TournamentsComp";
import Loader from "../../Components/Loader/Loader";

const ListTournament = ({tournaments, handleIncrementPage, count, limit, mainLoader, loadPageBtn}) => {
  return (
    <>
    <TableContainer>
            <Table variant='simple'>
              <Thead className='table_head'>
                <Tr>
                  <Th className='table_header_item'>SL NO</Th>
                  <Th className='table_header_item'>Title</Th>
                  <Th className='table_header_item'>Image</Th>
                  <Th className='table_header_item'>Stream Date</Th>
                  <Th className='table_header_item'>Stream Time</Th>
                  <Th className='table_header_item'>Status</Th>
                  <Th className='table_header_item'>Action</Th>
                </Tr>
              </Thead>
              {mainLoader ? (
                // Loader Section
                <Tr className='empty_table_row'>
                  <Td className='empty_table_row' colSpan='7'>
                    <Box className='empty_table_list'>
                      <Loader />
                    </Box>
                  </Td>
                </Tr>
              ) : (
                <>
                  {(tournaments || []).length > 0 ? (
                    // Rendering components
                    <>
                      {tournaments.map((data, index) => (
                        <Tbody key={data._id}>
                          <TournamentsComp data={data} index={index} />
                        </Tbody>
                      ))}

                      {count === limit && (
                        <Tr className='empty_table_row'>
                          <Td className='empty_table_row' colSpan='7'>
                            <Box className='loadmore_table_list'>
                              <Button
                                className='load_more_btn'
                                onClick={handleIncrementPage}>
                                {loadPageBtn ? <Spinner /> : <>Load More</>}
                              </Button>
                            </Box>
                          </Td>
                        </Tr>
                      )}
                    </>
                  ) : (
                    // Empty list section
                    <Tr className='empty_table_row'>
                      <Td className='empty_table_row' colSpan='5'>
                        <Box className='empty_table_list'>No data found</Box>
                      </Td>
                    </Tr>
                  )}
                </>
              )}
            </Table>
          </TableContainer> 
    </>
  )
}

export default ListTournament;