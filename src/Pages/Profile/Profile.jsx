import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import {GlobalContext} from "../../Context/Context";
import Layout from '../../Layout/Layout';
import "./Profile.css";
import Loader from '../../Components/Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {MdKeyboardBackspace} from "react-icons/md"
import StreamSection from './StreamSection';
import PredictionSection from './PredictionSection';
import WalletSection from './WalletSection';

const Profile = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    const {setPageType} = GlobalContext();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    useLayoutEffect(() => {
        setPageType('profile')
    }, []);

    useEffect(() => {
        setLoading(true);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/profile//user-profile/${id}`,
            headers: { 
              'authorization': `Bearer ${localStorage.getItem("token")}`
            }
          };
          axios.request(config)
          .then((response) => {
            console.log(response.data.userdetails);
            setProfile(response.data.userdetails);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setProfile(null);
            setLoading(false);
          });
    },[id])

    return (
        <Layout>
            {
                loading ? 
                <Box className='profile_loading_container'>
                    <Loader />
                </Box> : 
                <Box>
                    {
                        profile ? 
                        <Box className='profile_container'>
                            <Box className='header_section'>
                                <Box className='header_back_section'>
                                    <Button className='back_button' onClick={() => navigate(-1)}>
                                        <MdKeyboardBackspace />
                                    </Button>
                                    <span className='header_title'>Profile</span>
                                </Box>
                            </Box>
                            {/* Profile Section Information */}
                            <Box className='profile_info_'>
                                <Box className="section_header">User details</Box>
                                {/* Profile information box */}
                                <Box className='profile_info_box'>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Profile ID</Box>
                                        <Box className="profile_info_data">{profile._id}</Box>
                                    </Box>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Name</Box>
                                        <Box className="profile_info_data">{profile.name}</Box>
                                    </Box>
                                </Box>

                                <Box className='profile_info_box'>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Email</Box>
                                        <Box className="profile_info_data">{profile.email}</Box>
                                    </Box>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Phone</Box>
                                        <Box className="profile_info_data">{profile.phone || <>Not applicable</>}</Box>
                                    </Box>
                                </Box>

                                <Box className='profile_info_box'>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Status</Box>
                                        <Box className={profile.status === "active" ? "profile_info_data active_text" : "profile_info_data inactive_text"}>{profile.status.toUpperCase()}</Box>
                                    </Box>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Account Type</Box>
                                        <Box className={profile.accountType === "streamer" ? "profile_info_data streamer_text" : "profile_info_data user_text"}>{profile.accountType.toUpperCase()}</Box>
                                    </Box>
                                </Box>

                                <Box className='profile_info_box'>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Followers</Box>
                                        <Box className="profile_info_data">{profile.followerCount}</Box>
                                    </Box>
                                    <Box className='profile_info'>
                                        <Box className="profile_info_title">Following</Box>
                                        <Box className="profile_info_data">{profile.following.length || 0}</Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Profile stream section */}
                            <StreamSection id={id} />

                            {/* Profile prediction */}
                            {/* <PredictionSection id={id} /> */}

                            {/* Profile Wallet */}
                            <WalletSection id={id} />
                        </Box> :
                        <Box className='empty_profile_container'>No user data found</Box>
                    }
                </Box>
            }
        </Layout>
    )
}

export default Profile