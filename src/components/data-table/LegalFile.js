import { useEffect } from 'react';
import useAxios from '../../api/axios';
import { useState } from 'react';
import FsLightbox from 'fslightbox-react';
const LegalFile = ({ document }) => {
  const [toggler, setToggler] = useState(false);

  //   const [imageData, setImageData] = useState(null);
  //   const api = useAxios();
  //   const getImage = async (document) => {
  //     const response = await api.get(`http://localhost:5001/api/documents/${document}`);
  //     console.log(response)
  //     const data = await response.arrayBuffer();
  //     const blob = new Blob([data], { type: 'image/png' });
  //     const url = URL.createObjectURL(blob);
  //     setImageData(url);
  //   };
  //   useEffect(() => {
  //     getImage(document);
  //   }, []);
  return (
    <>
      <img
        src={`http://localhost:5001/api/documents/${document}?w=248&fit=crop&auto=format`}
        srcSet={`http://localhost:5001/api/documents/${document}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={document}
        loading="lazy"
        onClick={() => setToggler(!toggler)}
      />
      {/* {isOpen && (
        <Lightbox
          mainSrc={src}
          onCloseRequest={handleClick}
          enableZoom={true}
        />
      )} */}
      <div className="lightbox">
        <FsLightbox toggler={toggler} sources={[`http://localhost:5001/api/documents/${document}`]} />
      </div>
    </>
  );
};

export default LegalFile;
