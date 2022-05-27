import React, { useState } from 'react';
import {
  AppBar,
  Dialog,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Slide,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
  AlertTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageUploader from 'react-images-upload';
import * as api from '../../api';
import showToast from '../../utils/showToastNotification';
import { SUCCESS, ERROR } from '../../store/types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UploadImageDialog(props) {
  const { isOpen, setOpen, appendImage } = props;
  const [title, setTitle] = useState('');
  const [pictures, setPictures] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      let errorMsg = '';
      if (!title) {
        errorMsg = 'Please provide a valid title.';
      }
      if (!pictures.length || pictures[0] === undefined) {
        errorMsg = 'Please select an image first.';
      }
      if (errorMsg) {
        showToast(ERROR, errorMsg);
        return;
      }
      setIsUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', pictures[0]);
      const { data } = await api.uploadImage(formData);
      appendImage(data);
      navigator.clipboard.writeText(data?.imageUrl);
      showToast(SUCCESS, 'Image uploaded and Image URL copied to clipboard!');
      setOpen(false);
      setPictures([]);
      setTitle('');
    } catch (e) {
      const message = e?.response?.data?.message || 'Error in uploading image';
      showToast(ERROR, message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={() => setOpen(false)} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Upload Image
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ margin: 2, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1,
          }}
        >
          <Alert variant="filled" severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>
              It is recommended to compress your image using either{' '}
              <Link href="https://squoosh.app/" target="_blank" rel="noopener" color="#faebd7">
                squoosh.app
              </Link>{' '}
              or{' '}
              <Link href="https://caesium.app/" target="_blank" rel="noopener" color="#faebd7">
                caesium.app
              </Link>{' '}
              before uploading, to reduce loading time of your webpage.
            </AlertTitle>
          </Alert>
          <ImageUploader
            singleImage={true}
            withIcon={true}
            buttonText="Select image"
            imgExtension={['.jpg', '.png', '.jpeg']}
            maxFileSize={1500000}
            withPreview={true}
            label="Max file size: 1.5mb, accepted: jpg, png"
            onChange={([image]) => {
              setPictures([image]);
            }}
          />
          {!!pictures.length && pictures[0] !== undefined && (
            <TextField
              required
              id="title"
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          )}
          <Box sx={{ p: 1, my: 0, mx: 'auto' }}>
            <Button variant="contained" color="success" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  Uploading
                  <CircularProgress />
                </>
              ) : (
                <>Upload</>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default UploadImageDialog;
