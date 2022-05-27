import { Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from '../../../api';
import Gallery from 'react-grid-gallery';
import ErrorAlert from '../../../components/common/ErrorAlert';
import InfoAlert from '../../../components/common/InfoAlert';
import Loader from '../../../components/common/Loader';
import UploadImageDialog from '../../../components/images/UploadImageDialog';
import showToast from '../../../utils/showToastNotification';
import { INFO_BOTTOM, ERROR } from '../../../store/types';
import DeleteImageDialog from '../../../components/images/DeleteImageDialog';
import { ADMIN } from '../../../store/roles';

const MyImages = () => {
  const { authData } = useSelector((state) => state.auth);
  const [areImagesLoading, setAreImagesLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState('');
  const [isUploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const userId = authData?.user?.id;
  const role = authData?.user?.role;

  const showAll = false;
  const showDelete = role === ADMIN || !showAll;

  const fetchImages = async () => {
    try {
      if (userId) {
        setAreImagesLoading(true);
        if (showAll) {
          const { data } = await api.getAllImages();
          setImages(data);
        } else {
          const { data } = await api.getImagesByCreator(userId);
          setImages(data);
        }
      }
    } catch (e) {
      const message = e?.response?.data?.message || `Unable to load images`;
      setImagesError(message);
    } finally {
      setAreImagesLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [userId, showAll]);

  const galleryImages = images.map(({ imageUrl, title }) => ({
    src: imageUrl,
    thumbnail: imageUrl,
    caption: title,
    thumbnailCaption: (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          maxWidth: 'fit-content',
          minWidth: '100%',
          textAlign: 'center',
        }}
      >
        {title}
      </div>
    ),
    thumbnailWidth: 450,
    thumbnailHeight: 450,
  }));

  const handleCopy = () => {
    navigator.clipboard.writeText(galleryImages[currentImage].src);
    showToast(INFO_BOTTOM, 'Image URL copied.');
  };

  const handleDelete = async () => {
    try {
      await api.deleteImage(images[currentImage].id);
      const newImages = images.filter((image, idx) => idx !== currentImage);
      setImages(newImages);
      setDeleteDialogOpen(false);
    } catch (e) {
      const message = e?.response?.data?.message || 'Error in deleting image';
      showToast(ERROR, message);
    }
  };

  if (areImagesLoading) {
    return <Loader />;
  } else if (imagesError) {
    return <ErrorAlert message={imagesError} />;
  } else {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => {
              setUploadDialogOpen(true);
            }}
          >
            Upload image
          </Button>
        </div>
        {images.length === 0 && <InfoAlert message="No image found" />}
        {!!images.length && (
          <div style={{ width: '100%' }}>
            <br />
            <Gallery
              images={galleryImages}
              enableLightbox={true}
              showLightboxThumbnails={true}
              enableImageSelection={false}
              margin={4}
              currentImageWillChange={(idx) => {
                setCurrentImage(idx);
              }}
              customControls={[
                <Stack direction="row" spacing={2} key={'1'} sx={{ mb: 2, color: 'white' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    aria-label="copy-link"
                    sx={{ mr: 0, ml: 'auto' }}
                    startIcon={<ContentCopyIcon htmlColor="white" />}
                    onClick={() => {
                      handleCopy();
                    }}
                  >
                    Copy URL
                  </Button>
                  {showDelete && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      aria-label="delete"
                      sx={{ mr: 2 }}
                      startIcon={<DeleteIcon htmlColor="white" />}
                      onClick={() => {
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </Stack>,
              ]}
            />
          </div>
        )}
        <UploadImageDialog
          isOpen={isUploadDialogOpen}
          setOpen={setUploadDialogOpen}
          appendImage={(img) => {
            setImages([img, ...images]);
          }}
        />
        <DeleteImageDialog
          openDialog={isDeleteDialogOpen}
          handleCloseDialog={() => setDeleteDialogOpen(close)}
          handleDelete={handleDelete}
        />
      </>
    );
  }
};

export default MyImages;
