import {dashboard, createCampaign, payment, withdraw, profile, logout} from "../assets"
export const navlinks = [
    {
        name: 'dashboard',
        imgUrl: dashboard,
        link: '/',
    },
    {
        name: 'campaign',
        imgUrl: createCampaign,
        link: '/create-campaign',
    },
    {
        name: 'payment',
        imgUrl: payment,
        link: '/',
        disabled: true,
    },
    {
        name: 'withdraw',
        imgUrl: withdraw,
        link: '/',
        disabled: true,
    },
    {
        name: 'profile',
        imgUrl: profile,
        link: '/profile',
    },
    {
        name: 'logout',
        imgUrl: logout,
        link: '/',
        disabled: true,
    },
];