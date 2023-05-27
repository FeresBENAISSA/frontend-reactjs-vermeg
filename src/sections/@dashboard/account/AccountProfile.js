import {
  Card,
  Avatar,
  Box,
  CardActions,
  CardContent,
  Divider,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material';
import { useRef, useState } from 'react';
import useAxios from '../../../api/axios';
import { BASE_URL } from '../../../Constants';
// import Input from '../../../theme/overrides/Input';
// import Card from "../../../theme/overrides/Card";
// import Typography from "../../../theme/overrides/Typography";
import { Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountProfile = ({getCurrentUser,user, setUser,handleApiResponse}) => {
  // const [user, setUser] = useState();
  const ImageInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const api = useAxios();
  const [openPreview, setOpenPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
      setPreviewImage(URL.createObjectURL(file)); // set preview image URL

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
  const handleClickOpen = () => {
    setOpenPreview(true);
  };
  const handleClose = () => {
    setOpenPreview(false);
  };
 
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    console.log(selectedImage)
    try {
      console.log(formData);
      const response = await api.post('api/users/upload', formData);
      console.log(response);
      console.log(response.data);
      if (response.status === 201) {
        handleApiResponse(response);
        getCurrentUser();
        // setAvatar(BASE_URL + response.data.avatar.split('\\')[1]);
        setSelectedImage(null);
        setPreviewImage(null);
        
      }
      // handle successful response here
    } catch (error) {
      console.error(error);
      // handle error here
    }
  };
  if (user)
    return (
      <>
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
              <Typography  key={role}color="text.secondary" variant="body2">
                {role}
              </Typography>
            ))}
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
        <Stack
         sx={{
          width: '100%',
     
        }}>
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
          <br/>
          {selectedImage && (
            <>
              <Alert severity="success" style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography inline color="text.secondary" variant="body2" component="span">
                    Selected Image: {selectedImage.name}
                  </Typography>
                  <Button color="success" inline onClick={handleClickOpen}>
                    Preview Logo
                  </Button>
                </Alert>
                <br/>

              <Button fullWidth variant="text" onClick={handleUpload}>
                Upload
              </Button>
            </>
          )}
 
          <Dialog open={openPreview} onClose={handleClose}>
              <DialogTitle>Profile Avatar Preview</DialogTitle>
              <DialogContent>
                <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="preview" />
                <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleClose}>
                  <Close />
                </IconButton>
              </DialogContent>
            </Dialog> 
            </Stack>
          {/* <TextField name="upload-photo" type="file" /> */}
        </CardActions>

      </Card>
            

      </>
    );
  else return <></>;
};

export default AccountProfile;
