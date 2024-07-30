import Cart from '@/pages/Cart';
import Home from '@/pages/Home';
import UpdateProduct from '@/pages/UpdateProduct';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UpdateIcon from '@mui/icons-material/Update';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddProduct from '@/pages/AddProduct';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import History from '@/pages/History';

const menuItems = [
    {
        title:"Home",
        href: "",
        icon:<HomeIcon/>,
        component:<Home/>,
        role:["user", "admin"]
    },
    {
        title: 'Cart',
        href: 'cart',
        icon: <ShoppingCartIcon/>,
        component: <Cart/>,
        role:["user"],
    },
    {
        title: 'Update Product',
        href: 'update',
        icon: <UpdateIcon/>,
        component: <UpdateProduct />,
        role:["admin"],
    },
    {
        title: 'Add Product',
        href: 'add-product',
        icon: <AddCircleIcon/>,
        component: <AddProduct />,
        role:["admin"],
    },
    {
        title: 'History',
        href: 'history',
        icon: <WorkHistoryIcon/>,
        component: <History/>,
        role:["user"]
    },
   
];

export default menuItems;