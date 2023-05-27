/* eslint-disable react/no-array-index-key */

import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import Title from './Title';
import { BASE_URL } from '../../Constants';
// import List, { Item } from './List';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0,
    },
  },
  entryContainer: {
    marginBottom: 10,
  },
  date: {
    fontSize: 11,
    fontFamily: 'Lato Italic',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Lato Italic',
  },
  detailContainer: {
    flexDirection: 'row',
  },
  detailLeftColumn: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
  },
  detailRightColumn: {
    flexDirection: 'column',
    flexGrow: 9,
  },
  bulletPoint: {
    fontSize: 10,
  },
  details: {
    fontSize: 10,
    fontFamily: 'Lato',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: 'column',
    flexGrow: 9,
  },
  rightColumn: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'flex-end',
    justifySelf: 'flex-end',
  },
  title: {
    fontSize: 11,
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'Lato Bold',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  itemContent: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Lato',
  },
  imageBrand:{
    width:50
  }
});

export const Item = ({ children }) => (
  <View style={styles.item}>
    <Text style={styles.bulletPoint}>•</Text>
    <Text style={styles.itemContent}>{children}</Text>
  </View>
);

const DescriptionEntry = ({
  productLabel,
  productDescription,
  categoryTitle,
  categoryDescription,
  date,
  price,
  brandTitle,
  brandDescription,
  brandLogo
}) => {
  //   const title = `${company} | ${position}`;
  return (
    <View style={styles.entryContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{productLabel}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <Item style={styles.detailContainer}>{productDescription}</Item>
      <Item style={styles.detailContainer}>
        {categoryTitle} : {categoryDescription}
      </Item>
      <Item style={styles.detailContainer}>
        {brandTitle} : {brandDescription}
      </Item>

      <View style={styles.headerContainer}>
        <View style={styles.leftColumn}>
          <Image
            src={brandLogo}
            style={styles.imageBrand}
          />
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.price}>{price}$</Text>
        </View>
      </View>
    </View>
  );
};

const Description = ({ data }) => (
  <View style={styles.container}>
    <Title>Product : {data.productLabel}</Title>
    <DescriptionEntry
      productLabel={data?._id}
      date={data?.productReference}
      productDescription={data?.productDescription}
      categoryDescription={data?.category?.description}
      categoryTitle={data?.category?.title}
      brandTitle={data?.brand ? data?.brand?.title : ''}
      brandDescription={data?.brand ? data?.brand?.description : ''}
      brandLogo={data.brand ? `${BASE_URL}${data.brand.logo.split('\\')[1]}` : null}
      price={data?.productSellingPrice}
      position={'position'}
    />
    {/* {experienceData.map(({ company, date, details, position }) => (
      <DescriptionEntry
        company={company}
        date={date}
        details={details}
        key={company + position}
        position={position}
      />
    ))} */}
  </View>
);

export default Description;
