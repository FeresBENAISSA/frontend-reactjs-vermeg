import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from '@mui/icons-material';
import MyDocument from '../PrintDocument/MyDocument';
import { CircularProgress } from '@mui/material';
import QRCode from 'qrcode.react';
import SelectedDocument from '../PrintDocument/SelectedDocument';

function DownloadPDFButton({ data,handlePrintData }) {
  // const qrCodeDataURI = QRCode.toDataURL(data._id);
  return (
    <PDFDownloadLink document={Array.isArray(data) ? <SelectedDocument data={data} /> : <MyDocument data={data} />} fileName="document.pdf" onClick={Array.isArray(data) ? ()=>handlePrintData:null}>
      {({ blob, url, loading, error }) => (loading ? <CircularProgress /> : <Download />)}
    </PDFDownloadLink>
  );
}

export default DownloadPDFButton;
