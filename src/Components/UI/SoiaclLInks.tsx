'use client';
import { MdOutlineFacebook } from 'react-icons/md';
import { FaGithub, FaWhatsapp, FaLinkedin, FaYoutube } from 'react-icons/fa6';
import { Tooltip } from '@mui/material';
import { useAppContext } from '@/Context/AppContext';

interface SocialItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hover: string;
}

const SOCIALS: SocialItem[] = [
  {
    href:  'https://web.facebook.com/furqan.don.771/',
    label: 'Facebook',
    icon:  <MdOutlineFacebook size={22} />,
    color: '#1877f2',
    hover: '#1557b0',
  },
  {
    href:  'https://wa.me/03141868872',
    label: 'WhatsApp',
    icon:  <FaWhatsapp size={20} />,
    color: '#25d366',
    hover: '#1aab53',
  },
  {
    href:  'https://github.com/psycho-70',
    label: 'GitHub',
    icon:  <FaGithub size={20} />,
    color: '#24292e',
    hover: '#444d56',
  },
  {
    href:  'https://www.linkedin.com/in/furqan-ktk-856552191',
    label: 'LinkedIn',
    icon:  <FaLinkedin size={20} />,
    color: '#0a66c2',
    hover: '#004182',
  },
  {
    href:  'https://www.youtube.com/@furqankhattak71',
    label: 'YouTube',
    icon:  <FaYoutube size={20} />,
    color: '#ff0000',
    hover: '#cc0000',
  },
];

const SocialLinks = () => {
  const { darkMode } = useAppContext();

  return (
    <ul className={`hidden md:flex flex-col gap-5 list-none`}>
      {SOCIALS.map(({ href, label, icon, color }) => (
        <li key={label}>
          <Tooltip title={label} arrow placement="left">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg"
              style={{ background: color }}
            >
              {icon}
            </a>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;