import {
  Input,
  Card,
  Avatar,
  Box,
  CardActions,
  CardContent,
  Divider,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../../api/axios';
import { BASE_URL } from '../../../Constants';
import { updateUserAvatar } from '../../../redux/features/auth/authSlice';
// import Input from '../../../theme/overrides/Input';
// import Card from "../../../theme/overrides/Card";
// import Typography from "../../../theme/overrides/Typography";

const AccountProfile = ({getCurrentUser,user, setUser}) => {
  // const [user, setUser] = useState();
  const ImageInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const api = useAxios();

  // const getCurrentUser = async () => {
  //   const response = await api.get(`/api/users/current`);
  //   console.log(response.data.user);
  //   setUser(response.data.user);
  //   dispatch(updateUserAvatar(response.data.user.avatar));
  // };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };

  const handleButtonClick = () => {
    ImageInput.current.click();
  };

  // const { user } = props;
  // const ImageInput = useRef();
  // const [selectedImage, setSelectedImage] = useState(null);
  // const api = useAxios();
  // const [avatar, setAvatar] = useState();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (user.avatar) setAvatar(BASE_URL + user.avatar.split('\\')[1]);
  // }, [user]);
  // const handleButtonClick = () => {
  //   ImageInput.current.click();
  // };
  // const handleImageSelect = (event) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === 'image/png') {
  //     setSelectedImage(file);
  //   } else {
  //     setSelectedImage(null);
  //     alert('Please select a valid PNG file');
  //   }
  // };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    console.log(formData);
    try {
      const response = await api.post('api/users/upload', formData);
      console.log(response);
      console.log(response.data);
      if (response.status == 201) {
        getCurrentUser();
        // setAvatar(BASE_URL + response.data.avatar.split('\\')[1]);
        setSelectedImage(null);
        alert('file uploaded succcesfuly');
      }
      // handle successful response here
    } catch (error) {
      console.error(error);
      // handle error here
    }
  };
  if (user)
    return (
      <Card sx={{ ml: 3, mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Avatar
              src={user.avatar ? BASE_URL + user.avatar.split('\\')[1] : ''}
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
            />
            <Typography gutterBottom variant="h5">
              {user.username}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.firstname} {user.lastname}
            </Typography>

            {user.roles.map((role) => (
              <Typography color="text.secondary" variant="body2">
                {role}
              </Typography>
            ))}
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <input
            style={{ display: 'none' }}
            accept="image/png"
            id="user_image"
            onChange={handleImageSelect}
            name="user_image"
            type="file"
            ref={ImageInput}
          />
          <Button fullWidth variant="text" onClick={handleButtonClick}>
            Select picture
          </Button>
          {selectedImage && (
            <>
              <Typography color="text.secondary" variant="body2">
                Selected Image: {selectedImage.name}
              </Typography>

              <Button fullWidth variant="text" onClick={handleUpload}>
                Upload
              </Button>
            </>
          )}
          {/* <TextField name="upload-photo" type="file" /> */}
        </CardActions>
      </Card>
    );
  else return <></>;
};

export default AccountProfile;
