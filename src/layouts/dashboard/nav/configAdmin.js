// component
// ----------------------------------------------------------------------

const icon = (name) => <img src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} alt="avatar" />;


const navConfigAdmin = [
  {
    title: 'Admin dashboard ',
    path: '/dashboard/admin',
    icon: icon('ic_dashboard'),
  },
  {
    title: ' users',
    path: '/dashboard/user',
    icon: icon('ic_employee'),
  },
  {
    title: 'stores',
    path: '/dashboard/store',
    icon: icon('ic_stores'),
  },
  {
    title: 'Companies',
    path: '/dashboard/company',
    icon: icon('ic_company'),
  },
  {
    title: 'Chat',
    path: '/dashboard/chat',
    icon: icon('ic_chat'),
  },
  {
    title: 'profile',
    path: '/dashboard/adminProfile',
    icon: icon('ic_profile'),
  },
];

export default navConfigAdmin;
