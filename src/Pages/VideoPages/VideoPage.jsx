import React,{useState, useEffect, useLayoutEffect} from 'react';
import {Box, Button, Input, Textarea, Img, Spinner} from "@chakra-ui/react";
import { GlobalContext } from "../../Context/Context";
import Layout from "../../Layout/Layout";
import axios from "axios";
import "./VideoPage.css";
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useDebounce } from "../../Hooks/useDebouce";
import Loader from "../../Components/Loader/Loader";
import ReelsComponent from '../../Components/ReelsComponent/ReelsComponent';
import FullModal from '../../Components/modalComp/FullModal';

const VideoPage = () => {
    const { setPageType } = GlobalContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reels, setReels] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [openReelsModal, setOpenReels] = useState(false);
    const [searchLists, setSearchLists] = useState([]);
    const [title, setTitle] = useState("");
    const [game, setGame] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [prev, setPrev] = useState("");
    const [btnLoading, setBtnLoading] = useState(false)

    const debouncedSearchTerm = useDebounce(searchValue, 500);

    useLayoutEffect(() => {
        setPageType("reels");
    }, []);

    useEffect(() => {
        if(page === 1) setLoading(true);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/v1/reels/list?page=${page}&limit=${limit}`,
            headers: { }
          };
          
          axios.request(config)
          .then((response) => {
            setCount(response.data.reels.length);
            if(page === 1) {
                setReels(response.data.reels);
            } else {
                setReels(prev => [...prev, ...response.data.reels])
            }
            setLoading(false)
          })
          .catch((error) => {
            console.log(error);
          });
    }, [page]);

    useEffect(() => {
        if (searchValue.length > 1) {
          handleSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    const handleSearch = (debouncedSearchTerm) => {
        setLoading(true);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/v1/reels/serach-reels?value=${debouncedSearchTerm}`,
            headers: { }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(response.data)
            setSearchLists(response.data.reels);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    const closeImagePreview = () => {
        setImage("");
        setPrev("");
      };
      const handleImagechange = (e) => {
        setImage(e.target.files[0]);
        setPrev(URL.createObjectURL(e.target.files[0]));
      };

      const handleCreateReels = () => {
        setBtnLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("x-access-token", localStorage.getItem("token"));
        const formdata = new FormData();
        formdata.append("video", image);
        formdata.append("title", title);
        formdata.append("game", game);
        formdata.append("description", description);
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };
        fetch(`${process.env.REACT_APP_BASE_URL}api/v1/reels/create`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                setReels(prev => [result.reels, ...prev])
                setDescription("");
                setTitle("");
                setGame("");
                setPrev("");
                setImage("");
                setOpenReels(false);
                setBtnLoading(false)
            })
            .catch((error) => {
                console.error(error);
                setDescription("");
                setTitle("");
                setGame("");
                setPrev("");
                setImage("");
                setOpenReels(false);
                setBtnLoading(false)
            });
      }

  return (
    <Layout page='store'>
        <FullModal 
        isOpen={openReelsModal}
        onClose={() => setOpenReels(false)}
        title={"Create reels"}
        body={
            <Box className='store_modal_body'>
                <Input
                    type='text'
                    className='store_input'
                    placeholder='Enter reels title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    type='text'
                    className='store_input'
                    placeholder='Enter game title'
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                />
                <Textarea
                    type='text'
                    className='store_input'
                    placeholder='Gift details'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {image ? (
                <Box className='preview_image_container'>
                  <Img
                    src={prev}
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
                      accept='video/*'
                      onChange={(e) => handleImagechange(e)}
                    />
                  </label>
                </Box>
              )}
            </Box>
        }
        footer={
            <Box className='store_modal_footer'>
              <Button
                onClick={handleCreateReels}
                className='modal_footer_store_button'>
                {
                    btnLoading ? <Spinner /> : <>Add reels</>
                }
              </Button>
            </Box>
          }
        />
        <>
        {
            searchValue ? <>
            {
                loading ? 
                <Box className='store_loader_container'>
                <Loader />
                </Box> : 
            <>
            {/* Header */}
            <Box className="reels_page_header">
                <Box className='store_header_title'>
                    <Button className='back_button' onClick={() => navigate(-1)}>
                        <MdKeyboardBackspace />
                    </Button>
                    <span className='store_header_title'>Reels management</span>
                </Box>
                <Input 
                    type="search"
                    placeholder="Search..."
                    className="header_reels_search_input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                className='create_new_store_button'
                onClick={() => setOpenReels(true)}>
                    Add reels
                </Button>
            </Box>
                {
                    (searchLists || []).length > 0 ? 
                    <Box className="reels_page_body">
                            {
                                searchLists.map(data => (
                                    <ReelsComponent key={data._id} data={data} />
                                ))  
                            }
                        </Box> :
                    <Box className="empty_reels_page">No reels found</Box>
                }
            </>
            }
            </> : <>
            {
                loading ? 
                <Box className='store_loader_container'>
                <Loader />
                </Box> : 
            <>
            {/* Header */}
            <Box className="reels_page_header">
                <Box className='store_header_title'>
                    <Button className='back_button' onClick={() => navigate(-1)}>
                        <MdKeyboardBackspace />
                    </Button>
                    <span className='store_header_title'>Reels management</span>
                </Box>
                <Input 
                    type="search"
                    placeholder="Search..."
                    className="header_reels_search_input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                className='create_new_store_button'
                onClick={() => setOpenReels(true)}>
                    Add reels
                </Button>
            </Box>
                {
                    (reels || []).length > 0 ? 
                    <Box className="reels_page_body">
                            {
                                reels.map(data => (
                                    <ReelsComponent key={data._id} data={data} />
                                ))
                            }
                            <Box className='pagination_section'>
                                <Button className="pagination_btn" onClick={() => setPage(prev => prev +1)}>Load more</Button>
                            </Box>
                        </Box>:
                    <Box className="empty_reels_page">No reels found</Box>
                }
            </>
            }
            </>
        }
        </>
    </Layout>
  )
}

export default VideoPage