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
import { SheetClose } from '@/components/ui/sheet';
import SearchBox from './searchBox';
const navigationMenu = <ul className={`divide-y divide-solid ${styles.navlist}`}>
<li>
<div className="md:hidden block">
<SearchBox />
</div>
</li>
<li>
  <Link href='/'>
  <SheetClose>
      <Image height={20} width={20} src={overview_ico} alt=''/>
      Overview
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/request-notify'>
  <SheetClose>
    <Image height={20} width={20} src={notify_ico} alt=''/>
      Notifications
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/glance'>
  <SheetClose>
      <Image height={20} width={20} src={real_ico} alt=''/>
      At a Glance
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/tracking'>
  <SheetClose>
      <Image height={20} width={20} src={tracking_ico} alt=''/>
      Patient
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/registrations'>
  <SheetClose>
      <Image height={20} width={20} src={regis_ico} alt=''/>
      Registration
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/occupancy'>
  <SheetClose>
      <Image height={20} width={20} src={occu_ico} alt=''/>
      Occupancy
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/support'>
  <SheetClose>
      <Image height={20} width={20} src={support_ico} alt=''/>
      Support
  </SheetClose>
  </Link>
</li>
<li>
  <Link href='/my-profile'>
  <SheetClose>
      <Image height={20} width={20} src={profile_ico} alt=''/>
      My Profile
  </SheetClose>
  </Link>
</li>
<li id='authbox'>
  <AuthBox />
</li>
</ul>;

export default navigationMenu;