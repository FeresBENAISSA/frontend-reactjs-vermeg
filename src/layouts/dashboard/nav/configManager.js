// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const navConfigManager = [
  {
    title: 'Manager dashboard',
    path: '/dashboard/manager',
    icon: icon('ic_dashboard'),
  },
  // {
  //   title: 'Manager Employee',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'product',
    path: '/dashboard/product',
    icon: icon('ic_product'),
  },
  {
    title: 'categories',
    path: '/dashboard/categories',
    icon: icon('ic_category'),
  },
  {
    title: 'brands',
    path: '/dashboard/brands',
    icon: icon('ic_brands'),
  },
  {
    title: 'employee',
    path: '/dashboard/employee',
    icon: icon('ic_employee'),
  },
  {
    title: 'Chat',
    path: '/dashboard/chatStoreManager',
    icon: icon('ic_chat'),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: icon('ic_profile'),
  },
  // {
  //   title: 'products',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfigManager;
