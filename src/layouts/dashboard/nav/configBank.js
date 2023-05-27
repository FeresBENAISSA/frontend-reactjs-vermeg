// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const navConfigBank= [
  {
    title: 'Bank dashboard ',
    path: '/dashboard/bank',
    icon: icon('ic_dashboard'),
  },
  {
    title: 'Credit Applications',
    path: '/dashboard/credits',
    icon: icon('ic_credit'),
  },
  {
    title: 'profile',
    path: '/dashboard/bankprofile',
    icon: icon('ic_profile'),
  },
 
];

export default navConfigBank;
