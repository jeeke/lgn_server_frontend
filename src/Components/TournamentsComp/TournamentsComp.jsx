/** @format */

import React, { useState } from "react";
import {
  Box,
  Tr,
  Td,
  Img,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,Input
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import axios from "axios";
import AlertModal from "../modalComp/AlertModal";
import TourImage from "../../Assets/image.png";
import { useNavigate } from "react-router-dom";
import { useSocket, socket } from "../../socket/socket";
import { FaEdit } from "react-icons/fa";
import FullModal from "../modalComp/FullModal";
import ButtonComp from "../ButtonComp/AuthButton"
import InputComp from "../InputComp/InputComp";
import {MdClose} from "react-icons/md";
import {FiUpload} from "react-icons/fi"

const TournamentsComp = ({ data, index, setUpdateTournament }) => {
  const toast = useToast();
  const navigate = useNavigate();
  useSocket();
  const [isDelete, setIsDelete] = useState(data.is_deleted || false);
  const [tournamentId, setTournamentId] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [handleOpenStatusModal, setHandleOpenStatusModal] = useState(false);
  const [status, setStatus] = useState(data.is_active);
  const [statusValue, setStatusValue] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);

  // states
  const [title, setTitle] = useState(data.title);
  const [link, setLink] = useState(data.streaming_link);
  const [date, setDate] = useState(data.streaming_date);
  const [time, setTime] = useState(data.streaming_time);
  const [image, setImage] = useState(data.image);
  const [prevImage, setPrevImage] = useState("");
  const [streamImg, setStreamImage] = useState("");

  const [selectTitle, setSelectTitle] = useState('');
  const [selectLink, setSelectLink] = useState('');
  const [selectDate, setSelectDate] = useState('');
  const [selectTime, setSelectTime] = useState("");

  

  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setTournamentId(id);
  };

  const handleDeleteTournament = () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/tournament/${tournamentId}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setOpenDeleteModal(false);
        setIsDelete(response.data.tournment.is_deleted);
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (response.data.notification) {
          socket.emit("notification send", response.data.notification);
        }
      })
      .catch((error) => {
        console.log(error);
        setOpenDeleteModal(true);
      });
  };

  const handleChangeStatusModal = (value, id) => {
    setStatusValue(value);
    setTournamentId(id);
    setHandleOpenStatusModal(true);
  };

  const handleChangeStatus = () => {
    let data = JSON.stringify({
      is_active: statusValue,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/tournament/update-status/${tournamentId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setStatus(response.data.tournment.is_active);
        setHandleOpenStatusModal(false);
        toast({
          title: "Success.",
          description: `${response.data.mesage}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (response.data.notification) {
          socket.emit("notification send", response.data.notification);
        }
      })
      .catch((error) => {
        console.log(error);
        setHandleOpenStatusModal(false);
      });
  };

  const handleEditModal = (data) => {
    console.log(data)
    setOpenEditModal(true);
    setTournamentId(data._id);
    setSelectTitle(data.title);
    setSelectLink(data.streaming_link);
    setSelectDate(data.streaming_date);
    setSelectTime(data.streaming_time);
    setStreamImage(data.image)
  }

  const handleCloseImage = () => {
    setStreamImage("")
  }

  const handleEditTournament = () => {
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));
    const formdata = new FormData();
    formdata.append("streaming_link", selectLink);
    formdata.append("title", selectTitle);
    formdata.append("streaming_date", selectDate);
    formdata.append("streaming_time", selectTime);
    formdata.append("image", image || streamImg);
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_BASE_URL}api/tournament/edit-tournament/${tournamentId}`, requestOptions) // 
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      setTitle(result.data.title);
      setSelectTitle('');
      setDate(result.data.streaming_date);
      setSelectDate('');
      setLink(result.data.streaming_link);
      setSelectLink("")
      setTournamentId('');
      setTime(result.data.streaming_time)
      setSelectTime(result.data.image)
      setOpenEditModal(false);
    })
    .catch((error) => console.error(error));
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      {handleOpenStatusModal && (
        <AlertModal
          isOpen={handleOpenStatusModal}
          onClose={() => setHandleOpenStatusModal(false)}
          title={<>Status tournamnet</>}
          body={<Box>Do you want to change tournament status?</Box>}
          footer={
            <Box>
              <Button className='modal_btn' onClick={handleChangeStatus}>
                Yes!
              </Button>
            </Box>
          }
        />
      )}
      {openDeleteModal && (
        <AlertModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          title={<>Delete tournamnet</>}
          body={<Box>Do you want to delete this tournament?</Box>}
          footer={
            <Box>
              <Button
                className='modal_btn delete'
                onClick={handleDeleteTournament}>
                Delete
              </Button>
            </Box>
          }
        />
      )}

      {
        openEditModal && 
        <FullModal 
          isOpen={openEditModal} 
          onClose={() => setOpenEditModal(false)} 
          title="Edit tournament details"
          body={<Box className='create_tour_body'>
            <InputComp 
              type="text"
              placeholder="Enter tournament title"
              className='banner_input'
              value={selectTitle}
              handleChange={e => setSelectTitle(e.target.value)}
            />
            <InputComp 
              type="text"
              placeholder="Enter tournament link"
              className='banner_input'
              value={selectLink}
              handleChange={e => setSelectLink(e.target.value)}
            />
            <InputComp
              type='date'
              placeholder='provide Streaming date'
              className='banner_input'
              value={selectDate}
              handleChange={(e) => setSelectDate(e.target.value)}
            />
            <InputComp
              type='time'
              placeholder='provide Streaming time'
              className='banner_input'
              value={selectTime}
              handleChange={(e) => setSelectTime(e.target.value)}
            />
            {streamImg ? (
              <Box className='banner_image_preview_setion'>
                <Img src={streamImg} className='preview_image' />
                <Button className='close_prev_btn' onClick={handleCloseImage}>
                  <MdClose />
                </Button>
              </Box>
            ) : (
              <>
              {image ? (
              <Box className='banner_image_preview_setion'>
                <Img src={prevImage} className='preview_image' />
                <Button className='close_prev_btn' onClick={handleCloseImage}>
                  <MdClose />
                </Button>
              </Box>
            ) : (
              <Box className='banner_image_section'>
                <label htmlFor='banner_image'>
                  <FiUpload className='banner_file_icon' />
                </label>
                <Input
                  type='file'
                  id='banner_image'
                  className='file_input'
                  onChange={(e) => handleImageChange(e)}
                />
              </Box>
            )}
              </>
            )}
          </Box>}
          footer={
            <Box className='create_banner_footer'>
              <ButtonComp
                loading={false}
                disable={false}
                className='banner_create_btn'
                disableClassName='disable_banner_create_btn'
                text='Save'
                handleClick={handleEditTournament}
              />
            </Box>
          }
        />
      }

      {!isDelete && (
        <Tr>
          <Td className='td'>{index + 1}</Td>
          <Td className='td'>{title}</Td>
          <Td className='td'>
            <Img src={image || TourImage} className='table_image' />
          </Td>
          <Td className='td'>{date}</Td>
          <Td className='td'>{time}</Td>
          <Td className='td'>
              <Menu>
                <MenuButton
                  as={Button}
                  className={
                    status === "pending"
                      ? `active_btn user`
                      : status === "active"
                      ? "active_btn active"
                      : "active_btn inactive"
                  }>
                  {status.toUpperCase()}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    className='menu_item'
                    onClick={() => handleChangeStatusModal("active", data._id)}>
                    Active
                  </MenuItem>
                  <MenuItem
                    className='menu_item'
                    onClick={() =>
                      handleChangeStatusModal("inactive", data._id)
                    }>
                    Inactive
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          <Td className='td'>
            <Button
              className='table_delete_btn'
              onClick={() => handleOpenDeleteModal(data._id)}>
              <AiOutlineDelete />
            </Button>

            <Button
              className='table_edit_btn'
              onClick={() => navigate(`/tournament-details/${data._id}`)}>
              <FaRegEye />
            </Button>

            <Button
              className='table_edit_btn'
              onClick={() => handleEditModal(data)}>
              <FaEdit />
            </Button>
          </Td>
        </Tr>
      )}
    </>
  );
};

export default TournamentsComp;
