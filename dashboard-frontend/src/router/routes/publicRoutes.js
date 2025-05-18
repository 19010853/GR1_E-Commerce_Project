import { lazy } from "react";
import UnAuthorized from "../../views/UnAuthorized";
const Login = lazy(() => import('../../views/auth/Login'));
const Register = lazy(() => import('../../views/auth/Register'));
const AdminLogin = lazy(() => import('../../views/auth/AdminLogin'))
const Home = lazy(() => import('../../views/Home'))
const Success = lazy(() => import('../../views/Success'))

const publicRoutes = [

    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/admin/login',
        element: <AdminLogin />,
    },
    {
        path: '/unauthorized',
        element: <UnAuthorized />,
    },
    {
        path: '/success',
        element: <Success />,
    }
]

export default publicRoutes;