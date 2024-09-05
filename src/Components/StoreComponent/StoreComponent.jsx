/** @format */

import React,{useState, useEffect} from "react";
import {
  Box,
  Button,
  Img,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,Input, Textarea
} from "@chakra-ui/react";
import { MdMoreHoriz } from "react-icons/md";
import AlertModal from "../modalComp/AlertModal";
import axios from "axios";
import FullModal from "../modalComp/FullModal";
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";


const StoreComponent = ({ data }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false)
  const [isDelete, setIsDelete] = useState(data.status || false);
  const [listId, setListId] = useState("");
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [currency, setCurrency] = useState(data.currency_type);
  const [lgnCoin, setLgnCoin] = useState(data.lgn_coin_amount);
  const [policy, setPolicy] = useState(data.policy);
  const [amount, setAmount] = useState(data.amount);
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const handleOpenDeleteModal = (id) => {
    setListId(id);
    setOpenDeleteModal(true)
  }
  const handleDelete = () => {
    let data = JSON.stringify({
      "status": "inactive"
    });
   
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/store/update/status/${listId}`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(response.data);
      setIsDelete(response.data.data.status)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleOpenEditModal = (data) => {
    setOpenEditModal(true);
    setListId(data._id);
  }

  const closeImagePreview = () => {
    setImage("");
    setPrevImage("");
  };
  const handleImagechange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdatestoreData = () => {
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("description", description);
    formdata.append("title", title);
    formdata.append("amount", amount);
    formdata.append("currency_type", currency);
    formdata.append("policy", policy);
    formdata.append("lgn_coin_amount", lgnCoin);

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_BASE_URL}api/v1/store/update/details/${listId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      setOpenEditModal(false)
    })
    .catch((error) => console.error(error));
  }

  return (
    <Box className={isDelete === "inactive" ? 'store_component delete_item' : 'store_component'}>
      {/* Delete modal */}
      <AlertModal 
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={"Delete store item"}
        body={"Do you want to delete store item"}
        footer={
          <Button className="modal_btn" onClick={handleDelete}>Delete</Button>
        }
      />
      {/* Edit modal */}
      {openEditModal && (
        <FullModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          title={"Edit list item"}
          body={
            <Box className='store_modal_body'>
              {/* Title */}
              <Input
                type='text'
                className='store_input'
                placeholder='Enter gift title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {/* Description */}
              <Textarea
                type='text'
                className='store_input'
                placeholder='Gift details'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {/* Amount */}
              <Box className='amount_form'>
                <Input
                  type='number'
                  className='store_input'
                  placeholder='Gift price'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Menu classNam='currency_menu'>
                  <MenuButton className='currency_menu_btn' as={Button}>
                    {currency}
                    {/* <FaAngleDown className='currency_menu_icon' /> */}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => setCurrency("INR")}
                      className='currency_menu_item'>
                      INR
                    </MenuItem>
                    <MenuItem
                      onClick={() => setCurrency("Euro")}
                      className='currency_menu_item'>
                      Euro
                    </MenuItem>
                    <MenuItem
                      onClick={() => setCurrency("Dollar")}
                      className='currency_menu_item'>
                      Dollar
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>

              {/* <Input
                type='number'
                className='store_input'
                placeholder='Coupon amount'
                value={couponAmount}
                onChange={(e) => setCouponAmount(e.target.value)}
              /> */}

              {/* LGN coin amount */}
              <Input
                type='number'
                className='store_input'
                placeholder='LGN coin amount'
                value={lgnCoin}
                onChange={(e) => setLgnCoin(e.target.value)}
              />

              {/* Coupon about details */}
              {/* <Textarea
                type='text'
                className='store_input'
                placeholder='About'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              /> */}
              {/* Coupon Image details */}
              {image ? (
                <Box className='preview_image_container'>
                  <Img
                    src={prevImage}
                    alt='coupon image'
                    className='coupon_preview_image'
                  />
                  <Button
                    className='close_btn'
                    onClick={() => closeImagePreview()}>
                    <IoMdClose />
                  </Button>
                </Box>
              ) : (
                <Box className='upload_image_container'>
                  <label htmlFor='coupon_img'>
                    <FiUpload />
                    <Input
                      type='file'
                      id='coupon_img'
                      className='file_input'
                      onChange={(e) => handleImagechange(e)}
                    />
                  </label>
                </Box>
              )}
              <Textarea
                type='text'
                className='store_input'
                placeholder='Gift policy'
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
              />
            </Box>
          }
          footer={
            <Box className='store_modal_footer'>
              <Button
                className={"modal_footer_store_button"}
                onClick={handleUpdatestoreData}>
                Add
              </Button>
            </Box>
          }
        />
      )}
      

      <Menu>
        <MenuButton
          className='coupon_menu_btn'
          as={Button}
          rightIcon={<MdMoreHoriz />}></MenuButton>
        <MenuList>
          {
            isDelete === "active" &&
            <MenuItem className='coupon_menu_item' onClick={() => handleOpenEditModal(data)}>Edit</MenuItem>
          }
          <MenuItem 
          className='coupon_menu_item delete_menu'
          onClick={() => handleOpenDeleteModal(data._id)}
          >Delete</MenuItem>
        </MenuList>
      </Menu>
      <Img src={data.image} className='coupon_image' />
      <Box className='coupon_title'>{data.title}</Box>
      <Box className='coupon_amount'>
        Worth: <span className='currency_type'>{data.currency_type}</span>{" "}
        {data.amount}
      </Box>
      <Box className='coupon_amount'>LGN coin: {data.lgn_coin_amount}</Box>
    </Box>
  );
};

export default StoreComponent;
