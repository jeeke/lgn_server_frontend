/** @format */

import React, { useState } from "react";
import { Box, Tr, Td, Img, Button, useToast, Input, Spinner } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import AlertModal from "../modalComp/AlertModal";
import FullModal from "../modalComp/FullModal";
import Inputcomp from "../../Components/InputComp/InputComp";
import { FiUpload } from "react-icons/fi";
import {MdClose} from "react-icons/md";

const BannerComp = ({ data, index }) => {
  const toast = useToast();
  const [status, setStatus] = useState(data.status);
  const [isDelete, setIsDelete] = useState(data.isDelete);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bannerId, setBannerId] = useState("");
  const [title, setTitle] = useState(data.name);
  const [link, setLink] = useState(data.link);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [originalBannerImage, setOriginalBannerImage] = useState(data.image);
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChangestatus = (id, value) => {
    let data = JSON.stringify({
      status: value,
    });
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/banners/update/status/${id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        // console.log((response.data));
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (response.data.status === 200) {
          setStatus(value);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* API to delete banner */
  const handleDeleteBanner = () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/banners/delete/${bannerId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };
    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (response.data.status === 200) {
          setIsDelete(true);
          setOpenDeleteModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* Handle open delete modal */
  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setBannerId(id);
  };

  /* Handle open edit modal */
  const handleOpenEditModal = (id) => {
    setOpenEditModal(true);
    setBannerId(id);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleCloseImage = () => {
    setImage("");
    setPrevImage("");
    setOriginalBannerImage("")
  };
  /* API to update banner details */
  const handleUpdateBannerEdit = () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    const formdata = new FormData();
    formdata.append("name", title);
    formdata.append("link", link);
    formdata.append("image", image);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_BASE_URL}api/v1/banners/update/${bannerId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      toast({
        title: "Success.",
        description: `${result.message}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      if (result.status === 200) {
        setTitle(result.data.name);
        setLink(result.data.link);
        setOriginalBannerImage(result.data.image);
        setImage("");
        setPrevImage("");
        setLoading(false);
        setOpenEditModal(false);
      }
    })
    .catch((error) => {
      console.error(error)
    });
  };
  return (
    <>
      {/* Banner delete modal */}
      {openDeleteModal && (
        <AlertModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          title={<>Delete banner</>}
          body={<Box>Do you want to delete this banner?</Box>}
          footer={
            <Box>
              <Button className='modal_btn delete' onClick={handleDeleteBanner}>
                Delete
              </Button>
            </Box>
          }
        />
      )}
      {/* Banner edit modal */}
      <FullModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title={<>Edit banner</>}
        body={
          <Box className='create_banner_body'>
            {/* Banner Name */}
            <Box className='banner_form_input'>
              <Box className='banner_input_title'>BANNER NAME</Box>
              <Inputcomp
                type='text'
                placeholder='Banner name'
                className='banner_input'
                value={title}
                handleChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            {/* Banner Redirect link */}
            <Box className='banner_form_input'>
              <Box className='banner_input_title'>REDIRECT LINK</Box>
              <Inputcomp
                type='text'
                placeholder='Banner redirect link'
                className='banner_input'
                value={link}
                handleChange={(e) => setLink(e.target.value)}
              />
            </Box>

            {
              image ?
              <Box className='banner_image_preview_setion'>
                <Img src={prevImage} className='preview_image' />
                <Button className='close_prev_btn' onClick={handleCloseImage}>
                  <MdClose />
                </Button>
              </Box> :
              <>
              {
                originalBannerImage ?
                <Box className='banner_image_preview_setion'>
                  <Img src={originalBannerImage} className='preview_image' />
                    <Button className='close_prev_btn' onClick={handleCloseImage}>
                      <MdClose />
                    </Button>
                </Box> 
                : 
                <Box className='banner_image_section'>
                  <label htmlFor='banner_image'>
                    <FiUpload className='banner_file_icon' />
                  </label>
                  <Input 
                    type="file" 
                    id='banner_image' 
                    className='file_input' 
                    onChange={e => handleImageChange(e)} 
                  />
                </Box>
              }
              </>
            }
          </Box>
        }
        footer={
          <Button className='modal_btn' onClick={handleUpdateBannerEdit}>
            {
              loading ? <Spinner /> : <>Update</>
            }
          </Button>
        }
      />
      {!isDelete && (
        <Tr>
          <Td className='td'>{index}</Td>
          <Td className='td'>{title}</Td>
          <Td className='td'>
            <Img src={originalBannerImage} className='table_image' />
          </Td>
          <Td className='td'>
            {status === "active" ? (
              <Button
                className='table_btn active'
                onClick={() => handleChangestatus(data._id, "inactive")}>
                Active
              </Button>
            ) : (
              <Button
                className='table_btn inactive'
                onClick={() => handleChangestatus(data._id, "active")}>
                Inactive
              </Button>
            )}
          </Td>
          <Td className='td'>
            <Button
              className='table_delete_btn'
              onClick={() => handleOpenDeleteModal(data._id)}>
              <AiOutlineDelete />
            </Button>

            <Button
              className='table_edit_btn'
              onClick={() => handleOpenEditModal(data._id)}>
              <FaRegEdit />
            </Button>
          </Td>
        </Tr>
      )}
    </>
  );
};

export default BannerComp;
