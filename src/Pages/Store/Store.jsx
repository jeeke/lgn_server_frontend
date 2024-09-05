/** @format */

import React, { useState, useEffect, useLayoutEffect } from "react";
import { GlobalContext } from "../../Context/Context";
import Layout from "../../Layout/Layout";
import {
  Box,
  Button,
  Input,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Img,Checkbox
} from "@chakra-ui/react";
import "./Store.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import FullModal from "../../Components/modalComp/FullModal";
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import StoreComponent from "../../Components/StoreComponent/StoreComponent";
import { useDebounce } from "../../Hooks/useDebouce";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

const Store = () => {
  const { setPageType } = GlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState();
  // const [couponAmount, setCouponAmount] = useState();
  const [currency, setCurrency] = useState("INR");
  // const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [disable, setdisable] = useState(true);
  const [lists, setLists] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchLists, setSearchLists] = useState([]);
  const [lgnCoin, setLgnCoin] = useState();
  const [policy, setPolicy] = useState("");
  const [category, setCategory] = useState("");
  const [isFeature, setIsFeature] = useState(false)

  const debouncedSearchTerm = useDebounce(searchValue, 500);


  useEffect(() => {
    if (page === 1) setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/store/list?page=${page}&limit=${limit}&search`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.coupons);
        if (page === 1) {
          setLists(response.data.coupons);
        } else {
          setLists((prev) => [...prev, ...response.data.coupons]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  useLayoutEffect(() => {
    setPageType("store");
  }, []);

  const handleImagechange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  const closeImagePreview = () => {
    setImage("");
    setPrevImage("");
  };

  useEffect(() => {
    if (
      !title.trim() ||
      !description.trim() ||
      amount < 0 ||
      !currency.trim() ||
      !image
    ) {
      setdisable(true);
    } else {
      setdisable(false);
    }
  }, [title, description, amount, currency, image]);

  const handleCreateStore = () => {
    setdisable(true);
    setBtnLoader(true);
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("image", image);
    // formdata.append("amount", amount);
    formdata.append("currency_type", currency);
    // formdata.append("available_coupons", couponAmount);
    formdata.append("lgn_coin_amount", lgnCoin);
    formdata.append("policy", policy);
    formdata.append("category", category);
    formdata.append("isFeature", isFeature);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_BASE_URL}api/v1/store/create`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLists((prev) => [result.data, ...prev]);
        console.log(result);
        setBtnLoader(false);
        setTitle("");
        setDescription("");
        setImage("");
        setAmount();
        setPrevImage("");
        setCurrency("");
        // setCouponAmount("");
        setLgnCoin();
        setPolicy("")
        setOpenCreateModal(false);
      })
      .catch((error) => {
        console.log("Error>", error);
        setBtnLoader(false);
        setTitle("");
        setDescription("");
        setImage("");
        setAmount();
        setPrevImage("");
        setCurrency("");
        // setCouponAmount("");
        setLgnCoin();
        setPolicy("")
        setOpenCreateModal(false);
      });
  };

  useEffect(() => {
    if (searchValue.length > 1) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (debouncedSearchTerm) => {
    setLoading(true)
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/store/search-product?value=${debouncedSearchTerm}`,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      // console.log(response.data);
      setSearchLists(response.data.data);
      setLoading(false)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // MyEditor.modules = {
  //   toolbar: [
  //     [{ 'header': '1' }, { 'header': '2' }],
  //     ['bold', 'italic', 'underline'],
  //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //     ['link', 'image'],
  //     ['clean']
  //   ],
  // };

  return (
    <Layout page='store'>
      {openCreateModal && (
        <FullModal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title={"Add new item"}
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

              {/* LGN coin amount */}
              <Input
                type='number'
                className='store_input'
                placeholder='LGN coin amount'
                value={lgnCoin}
                onChange={(e) => setLgnCoin(e.target.value)}
              />

              {/* Coupon catagory */}
              <Menu className="couipon_menu">
                <MenuButton className="couipon_menu_btn" as={Button}>
                  {
                    category ? <>{category}</> : <>Coupon category</>
                  }
                </MenuButton>
                <MenuList>
                  <MenuItem className="coupon_menu_item" onClick={() => setCategory("Coupon")}>Coupon</MenuItem>
                  <MenuItem className="coupon_menu_item" onClick={() => setCategory("Electronics")}>Electronics</MenuItem>
                  <MenuItem className="coupon_menu_item" onClick={() => setCategory("Food")}>Food</MenuItem>
                  <MenuItem className="coupon_menu_item" onClick={() => setCategory("Fashion")}>Fashion</MenuItem>
                </MenuList>
              </Menu>

              {/* Coupon feature box */}
              <Box>
              <Checkbox 
                className="select_box"
                isDisabled={false} 
                isChecked={isFeature}
                onChange={() => setIsFeature(true)}
              >
                Do you want to set this coupon as a feature product?
              </Checkbox>
              </Box>
              
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
              {/* <Textarea
                type='text'
                className='store_input'
                placeholder='Gift policy'
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
              /> */}
              <div>
                <ReactQuill
                  value={policy}
                  onChange={(html) => setPolicy(html)}
                />
              {/* <div dangerouslySetInnerHTML={{ __html: policy }} /> */}
              </div>
            </Box>
          }
          footer={
            <Box className='store_modal_footer'>
              <Button
                className={
                  disable
                    ? "modal_footer_store_button disable_btn"
                    : "modal_footer_store_button"
                }
                onClick={handleCreateStore}>
                Add
              </Button>
            </Box>
          }
        />
      )}
      <Box className='store_container'>
        <Box className='store_header'>
          <Box className='store_header_title'>
            <Button className='back_button' onClick={() => navigate(-1)}>
              <MdKeyboardBackspace />
            </Button>
            <span className='store_header_title'>Store management</span>
          </Box>
          <Input 
            type="search" 
            placeholder="Search..."
            className="header_search_input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
            className='create_new_store_button'
            onClick={() => setOpenCreateModal(true)}>
            Add item
          </Button>
        </Box>
        {loading ? (
          <Box className='store_loader_container'>
            <Loader />
          </Box>
        ) : (
          <>
          {
            searchValue ? 
            <Box classNam='store_managent_box'>
              {(searchLists || []).length > 0 ? (
                <Box className='render_coupons_component'>
                  {searchLists.map((list) => (
                    <StoreComponent key={list._id} data={list} />
                  ))}
              </Box>
            ) : (
              <Box className='empty_store_page'>No data found</Box>
            )}
            </Box>
             : 
            <Box classNam='store_managent_box'>
              {(lists || []).length > 0 ? (
                <Box className='render_coupons_component'>
                  {lists.map((list) => (
                    <StoreComponent key={list._id} data={list} />
                  ))}
              </Box>
            ) : (
              <Box className='empty_store_page'>No data found</Box>
            )}
          </Box>
          }
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Store;
