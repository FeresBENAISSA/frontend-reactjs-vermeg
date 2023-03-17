// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const navConfigBank= [
  {
    title: 'Bank dashboard ',
    path: '/dashboard/bank',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'profile',
    path: '/dashboard/bankprofile',
    icon: icon('ic_user'),
  },
];

export default navConfigBank;
