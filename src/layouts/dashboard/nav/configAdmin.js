// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const navConfigAdmin = [
  {
    title: 'Admin dashboard ',
    path: '/dashboard/admin',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'profile',
    path: '/dashboard/adminProfile',
    icon: icon('ic_user'),
  },
];

export default navConfigAdmin;
