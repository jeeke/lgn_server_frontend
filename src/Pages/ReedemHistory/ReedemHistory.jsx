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
    Spinner, useToast
} from "@chakra-ui/react";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "./ReedemHistory.css";
import { GlobalContext } from "../../Context/Context";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import Loader from "../../Components/Loader/Loader";
import axios from "axios";
import ReedemHistoryComponent from "../../Components/ReedemHistoryComponent/ReedemHistoryComponent";

const ReedemHistory = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { setPageType } = GlobalContext();
    const [loading, setLoading] = useState(false);
    const [lists, setLists] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(10);
    const [loadPageBtn, setLoadPageBtn] = useState(false);

    useEffect(() => {
        if (page === 1) {
            setLoading(true);
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/v1/store/reedem-history-list?page=${page}&limit=${limit}`,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data);
                setCount(response.data.result.length);
                if (page === 1) {
                    setLists(response.data.result);
                } else {
                    setLists(prev => [...prev, ...response.data.result]);
                }
                setLoading(false);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [page]);

    useLayoutEffect(() => {
        setPageType("ReedemHistory");
    }, []);

    const handleIncrementPage = () => {
        setPage(prev => prev + 1);
    };
    return (
        <Layout page='Reedem History'>
            <Box className='reedem_history_container'>
                <Box className='store_header'>
                    <Box className='store_header_title'>
                        <Button className='back_button' onClick={() => navigate(-1)}>
                            <MdKeyboardBackspace />
                        </Button>
                        <span className='store_header_title'>Reedem history</span>
                    </Box>
                </Box>
            </Box>
            <Box className='banner_section'>
                {
                    loading ?
                        <Box className="reedem_history_loader_page">
                            <Loader />
                        </Box> :
                        <>
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead className='table_head'>
                                        <Tr>
                                            <Th className='table_header_item'>SL NO</Th>
                                            <Th className='table_header_item'>Name</Th>
                                            <Th className='table_header_item'>Coupon title</Th>
                                            <Th className='table_header_item'>User address</Th>
                                            <Th className='table_header_item'>User phone</Th>
                                            <Th className='table_header_item'>Status</Th>
                                            <Th className='table_header_item'>Reedem date</Th>
                                        </Tr>
                                    </Thead>
                                    {(lists || []).length > 0 ? (
                                        // Rendering components
                                        <>
                                            {lists.map((data, index) => (
                                                <Tbody key={data._id}>
                                                    <ReedemHistoryComponent key={data._id} index={index} data={data} />
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
                                            <Td className='empty_table_row' colSpan='7'>
                                                <Box className='empty_table_list'>No data found</Box>
                                            </Td>
                                        </Tr>
                                    )}
                                </Table>
                            </TableContainer>
                        </>
                }
            </Box>
        </Layout>
    );
};

export default ReedemHistory;