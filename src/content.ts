export const pages = [
  {
    path: '/',
    title: 'Software for what comes next.',
    description:
      'WAUTECH LTD — software, cloud and connected digital experiences.',
  },
  {
    path: '/about/',
    title: 'A considered approach. A connected future.',
    description:
      'Get to know WAUTECH LTD and our approach to digital products.',
  },
  {
    path: '/services/',
    title: 'From first idea to lasting impact.',
    description:
      'Explore proposed software, SaaS, cloud, mobile and security services.',
  },
  {
    path: '/intelligence/',
    title: 'Your business. A clearer perspective.',
    description:
      'Introducing WAUTECH Intelligence CRM, a platform built around organizations.',
  },
  {
    path: '/contact/',
    title: 'Let’s build what’s next.',
    description:
      'Prepare a consultation or WAUTECH Intelligence demonstration enquiry.',
  },
  {
    path: '/privacy/',
    title: 'Privacy, by design.',
    description: 'Privacy information awaiting company review and approval.',
  },
  {
    path: '/terms/',
    title: 'Clear expectations. Better partnerships.',
    description: 'Terms and conditions awaiting company review and approval.',
  },
  {
    path: '/support/',
    title: 'Help, with a human perspective.',
    description: 'Support and future mobile account deletion information.',
  },
];
export const services = [
  [
    '01',
    'Custom software',
    'Purpose-built systems, shaped around the way your business works.',
    'Software development',
  ],
  [
    '02',
    'SaaS platforms',
    'Turn a product idea into a connected, maintainable software experience.',
    'SaaS development',
  ],
  [
    '03',
    'Cloud applications',
    'A foundation for reliable delivery, thoughtful operations and future growth.',
    'Cloud application development',
  ],
  [
    '04',
    'Native mobile',
    'Connected experiences for Android and iOS, designed for life on the move.',
    'Android & iOS development',
  ],
  [
    '05',
    'Security & consulting',
    'Bring clarity to technical decisions and security considerations.',
    'Cybersecurity & IT consulting',
  ],
];
export function pageFor(path: string) {
  return pages.find((p) => p.path === path);
}
