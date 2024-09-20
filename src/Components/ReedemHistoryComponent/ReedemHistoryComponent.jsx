import React, { useState } from "react";
import {
    Tr,
    Td,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem, useToast
} from "@chakra-ui/react";
import { FaAngleDown } from "react-icons/fa6";
import timeDifference from "../../utils/getTime";
import axios from "axios";
import AlertModal from "../modalComp/AlertModal";

const ReedemHistoryComponent = ({ data, index }) => {
    const toast = useToast();
    const [status, setStatus] = useState(data.status);
    const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
    const [id, setId] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const handleOpenStatusModal = (reedemId, value) => {
        setOpenUpdateStatusModal(true);
        setSelectValue(value);
        setId(reedemId);
    };

    const handleUpdatedStatusRequest = () => {
        console.log(`${process.env.REACT_APP_BASE_URL}api/v1/store/reedem-request/${id}`);
        let data = JSON.stringify({
            "value": selectValue
        });

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/v1/store/reedem-request/${id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data);
                toast({
                    title: "Success.",
                    description: `${response.data.message}`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setStatus(response.data.result.status);
                setOpenUpdateStatusModal(false);
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: "Error.",
                    description: `${error.response.data.message}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                setOpenUpdateStatusModal(false);
            });
    };
    return <>
        <AlertModal
            isOpen={openUpdateStatusModal}
            onClose={() => setOpenUpdateStatusModal(false)}
            title={"Update user reedem coupon status"}
            body={
                <>Do you want to pdate request status?</>
            }
            footer={
                <Button className='modal_btn' onClick={handleUpdatedStatusRequest}>Update</Button>
            }
        />
        <Tr>
            <Td className='td'>{index + 1}</Td>
            <Td className='td'>{data.userId ? data.userId.name : ""}</Td>
            <Td className='td'>{data.couponId.title}</Td>
            <Td className='td'>
                <Menu>
                    <MenuButton className={`table_btn active ${status}`} as={Button} rightIcon={<FaAngleDown />}>
                        {status.toUpperCase()}
                    </MenuButton>
                    <MenuList>
                        <MenuItem className="question_status_menu_item" onClick={() => handleOpenStatusModal(data._id, 'request')}>
                            Request
                        </MenuItem>
                        <MenuItem className="question_status_menu_item" onClick={() => handleOpenStatusModal(data._id, 'accept')}>
                            Accept
                        </MenuItem>
                        <MenuItem className="question_status_menu_item" onClick={() => handleOpenStatusModal(data._id, 'reject')}>
                            Reject
                        </MenuItem>
                        <MenuItem className="question_status_menu_item" onClick={() => handleOpenStatusModal(data._id, 'process')}>
                            Process
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Td>
            <Td className='td'>{data.userAddress || "NA"}</Td>
            <Td className='td'>{data.userPhone || "NA"}</Td>
            <Td className="td notification_decription">
                {timeDifference(new Date(), new Date(data.createdAt))}
            </Td>
        </Tr>
    </>;
};
export default ReedemHistoryComponent;

// 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