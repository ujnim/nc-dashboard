import { NavItem } from "@/types";

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Sign Up Boss',
    url: '/dashboard/nightcrows/sign-up-boss',
    icon: 'signature',
    isActive: false,
    shortcut: ['s', 's'],
    permission: ['master','admin','user'],
  },
  {
    title: 'Rankings',
    url: '/dashboard/nightcrows/rankings',
    icon: 'trophy',
    isActive: false,
    shortcut: ['r', 'r'],
    permission: ['master','admin','user'],
  },
  {
    title: 'History',
    url: '/',
    icon: 'history',
    isActive: false,
    shortcut: ['h', 'h'],
    permission: ['master','admin','user'],
  },
  {
    title: 'Connect User to Account',
    url: '/',
    icon: 'userRoundCog',
    isActive: false,
    shortcut: ['h', 'h'],
    permission: ['master','admin'],
  },
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
];

export interface ListBoss {
  type: string;
  items?: BossItem[];
}

export interface BossItem {
  id: string;  // Add id field
  name: string;
}

export const BossCaves: ListBoss[] = [
  {
    type: 'Ice Cavern',
    items: [
      { id: 'c2', name: 'C2' },
      { id: 'c7', name: 'C7' },
      { id: 'c8', name: 'C8' },
      { id: 'c9', name: 'C9' }
    ]
  },
  {
    type: 'Eerie Rock Sanctuary',
    items: [
      { id: 'r1', name: 'R1' },
      { id: 'r2', name: 'R2' },
      { id: 'r3', name: 'R3' },
      { id: 'r4', name: 'R4' },
      { id: 'r5', name: 'R5' },
    ]
  },
  {
    type: 'Battlefront',
    items: [
      { id: 'bf2', name: 'BF2 - Ruin Knight' },
      { id: 'bf3', name: 'BF3 - Tandallan' },
      { id: 'mini96', name: 'Mini96' },
    ]
  },
]

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
