/**
 * @format
 */
import { StyleSheet } from 'react-native';

import normalize from './normalize.ts';

export default StyleSheet.create({
  errors: {
    color: '#f00',
    paddingHorizontal: normalize(20),
    marginTop: normalize(3),
  },
  or: {
    marginTop: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(100),
  },
  orText: {
    marginHorizontal: normalize(5),
    fontWeight: '400',
    marginBottom: normalize(4),
  },
  orLine: {
    borderWidth: 0.2,
    width: '69%',
    justifyContent: 'flex-end',
  },
  input: {
    marginHorizontal: '4%',
    marginTop: '1%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    height: normalize(40),
  },
  heading: {
    fontSize: normalize(25),
    fontStyle: 'normal',
    fontWeight: '500',
  },
  label: {
    marginLeft: '4%',
    marginTop: '2%',
    fontWeight: '500',
  },
  subText: {
    marginTop: '4%',
    textAlign: 'center',
    color: '#2B2C43',
    fontSize: normalize(20),
    marginHorizontal: normalize(7),
    opacity: 0.3,
  },
  imageCenter: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
