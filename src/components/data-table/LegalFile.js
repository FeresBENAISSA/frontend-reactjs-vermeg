import { useEffect } from 'react';
import useAxios from '../../api/axios';
import { useState } from 'react';
import FsLightbox from 'fslightbox-react';
import { Close } from '@mui/icons-material';

import { Dialog, DialogContent, DialogTitle, IconButtonn,CircularProgress, IconButton  } from '@mui/material';
const LegalFile = ({ document }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClickOpen = () => {
    if (!imageSrc) {
      setImageSrc(
        `http://localhost:5001/api/documents/${document}?w=248&fit=crop&auto=format`
      );
    }
    setOpenPreview(true);
  };

  const handleClose = () => {
    setOpenPreview(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageSrc(null);
  };

  // Preload the image in the background
  const img = new Image();
  img.src = `http://localhost:5001/api/documents/${document}?w=248&fit=crop&auto=format`;
  img.onload = handleImageLoad;
  img.onerror = handleImageError;

  return (
    <>
      <div style={{ position: 'relative' }}>
        {!imageLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            <CircularProgress />
          </div>
        )}
        <div style={{ margin: '8px' }}>
          <img
            src={imageSrc}
            srcSet={`http://localhost:5001/api/documents/${document}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={document}
            loading="lazy"
            onClick={() => handleClickOpen()}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        </div>
      </div>
      <Dialog maxWidth="lg" maxHeight={500} open={openPreview} onClose={handleClose}>
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          {imageLoaded && (
            <img
              src={imageSrc}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              alt="preview"
            />
          )}
          {!imageLoaded && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
              }}
            >
              <CircularProgress />
            </div>
          )}
          <IconButton
            style={{ position: 'absolute', top: 10, right: 10 }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalFile;