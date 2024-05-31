import Image from 'next/image';
import Link from 'next/link';

import overview_ico from './icons/overview.png';
import notify_ico from './icons/notification.png';
import real_ico from './icons/realtime.png';
import tracking_ico from './icons/tracking.png';
import regis_ico from './icons/regis.png';
import occu_ico from './icons/occu.png';
import support_ico from './icons/support.png'
import profile_ico from './icons/myprofile.png';
import logout_ico from './icons/logout.png';
import { AuthBox } from '../authCheck';

import styles from './header.module.css';

const navigationMenu = <ul className={`divide-y divide-solid ${styles.navlist}`}>
<li>
  <Link href='/'>
      <Image height={20} width={20} src={overview_ico} alt=''/>
      Overview
  </Link>
</li>
<li>
  <Link href='/request-notify'>
    <Image height={20} width={20} src={notify_ico} alt=''/>
      Notifications
  </Link>
</li>
<li>
  <Link href='/glance'>
      <Image height={20} width={20} src={real_ico} alt=''/>
      At a Glance
  </Link>
</li>
<li>
  <Link href='/tracking'>
      <Image height={20} width={20} src={tracking_ico} alt=''/>
      Tracking
  </Link>
</li>
<li>
  <Link href='/registrations'>
      <Image height={20} width={20} src={regis_ico} alt=''/>
      Registration
  </Link>
</li>
<li>
  <Link href='/occupancy'>
      <Image height={20} width={20} src={occu_ico} alt=''/>
      Occupancy
  </Link>
</li>
<li>
  <Link href='/support'>
      <Image height={20} width={20} src={support_ico} alt=''/>
      Support
  </Link>
</li>
<li>
  <Link href='/my-profile'>
      <Image height={20} width={20} src={profile_ico} alt=''/>
      My Profile
  </Link>
</li>
<li>
  <AuthBox />
</li>
</ul>;

export default navigationMenu;