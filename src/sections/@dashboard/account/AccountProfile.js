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
import { useSelector } from 'react-redux';
import useAxios from '../../../api/axios';
import { selectCurrentUsername } from '../../../redux/features/auth/authSlice';
// import Input from '../../../theme/overrides/Input';
// import Card from "../../../theme/overrides/Card";
// import Typography from "../../../theme/overrides/Typography";

const AccountProfile = (props) => {
  const { user } = props;
  const ImageInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const api = useAxios();
  const [avatar, setAvatar] = useState();
  // const username = useSelector(selectCurrentUsername);
  // const user = {
  //     avatar: '/assets/avatars/avatar-anika-visser.png',
  //     city: 'Los Angeles',
  //     country: 'USA',
  //     jobTitle: 'Senior Developer',
  //     name: 'Anika Visser',
  //     timezone: 'GTM-7'
  //   };

  useEffect(() => {
    if(user.avatar)
    setAvatar('http://localhost:5001/' + user.avatar.split('\\')[1]);
  }, [user]);
  const handleButtonClick = () => {
    ImageInput.current.click();
  };
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    console.log(formData);
    try {
      const response = await api.post('api/users/upload', formData);
      console.log(response.data);
      if (response.status == 201) alert('file uploaded succcesfuly');
      // handle successful response here
    } catch (error) {
      console.error(error);
      // handle error here
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Avatar
            src={avatar}
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
};

export default AccountProfile;
