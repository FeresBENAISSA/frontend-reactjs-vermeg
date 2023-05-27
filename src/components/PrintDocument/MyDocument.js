import React from 'react';
import { Text, Font, Page, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { BASE_URL } from '../../Constants';

import Description from './Description';
import QRCode, { QRCodeCanvas } from 'qrcode.react';
import { useEffect } from 'react';
import { useRef } from 'react';

// import Header from './Header';
// import Skills from './Skills';
// import Education from './Education';
// import Experience from './Experience';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column',
    },
  },
  image: {
    marginBottom: 10,
  },
  imageQr: {
    marginLeft: 50,
    height: 50,
    width: 50,
  },
  leftColumn: {
    flexDirection: 'column',
    width: 170,
    paddingTop: 30,
    paddingRight: 15,
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  footer: {
    fontSize: 12,
    fontFamily: 'Lato Bold',
    textAlign: 'center',
    marginTop: 15,
    paddingTop: 5,
    borderWidth: 3,
    borderColor: 'gray',
    borderStyle: 'dashed',
    '@media orientation: landscape': {
      marginTop: 10,
    },
  },
  // qrCodeContainer: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   margin: 'auto',
  // },
  // qrCode: {
  //   width: 100,
  //   height: 100,
  // },
});

Font.register({
  family: 'Open Sans',
  src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`,
});

Font.register({
  family: 'Lato',
  src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
});

Font.register({
  family: 'Lato Italic',
  src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
});

Font.register({
  family: 'Lato Bold',
  src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
});

const Resume = (props) => (
  <Page {...props} style={styles.page}>
    {/* <Header /> */}
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Image
          src={props.data.productImages ? `${BASE_URL}${props.data.productImages[0].split('\\')[1]}` : ''}
          style={styles.image}
        />
        <Image
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${props.data._id}&amp;size=100x100`}
          style={styles.imageQr}
         /> 
        {/* <QRCodeCanvas  value={"ss"} size={100} bgColor="#FFFFFF" fgColor="#000000" ref={props.canvasRef} /> */}
      </View>
      <Description data={props.data} />
    </View>

    <Text style={styles.footer}>This IS the candidate you are looking for</Text>
  </Page>
);

function MyDocument({ data }) {


  return (
    <Document
      author="Luke Skywalker"
      keywords="awesome, resume, start wars"
      subject="The resume of Luke Skywalker"
      title="Resume"
    >
      <Resume size="A4" data={data} />
      {/* <Page size="A4" style={styles.page}>
        <View style={styles.entryContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.title}>{data.productLabel}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.date}>{data.productLabel}</Text>
            </View>
          </View> */}
      {/* <List> */}
      {/* {details.map((detail, i) => (
          <Item key={i} style={styles.detailContainer}>
            {detail}
          </Item>
        ))} */}
      {/* </List> */}
      {/* </View>
      </Page> */}
    </Document>
  );
}

export default MyDocument;
