'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BookButton from '../BookButton';
import s from './home.module.css';

export default function HomeNavigation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className={s.navigation} onKeyDown={event => { if (event.key === 'Escape') { close(); (event.currentTarget.querySelector('button') as HTMLButtonElement | null)?.focus(); } }}>
    <Link href="/" className={s.brand} aria-label="Chronexa home"><Image src="/images/logo.png" alt="" width={31} height={31} priority /><span>Chronexa</span></Link>
    <button type="button" className={s.menuToggle} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="home-navigation" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
    <nav id="home-navigation" aria-label="Primary" className={s.navigationLinks} data-open={open}>
      <a href="#services" onClick={close}>What we do</a><a href="#how-we-work" onClick={close}>How we work</a><a href="#selected-work" onClick={close}>Our work</a><Link href="/blog" onClick={close}>Insights</Link><Link href="/about" onClick={close}>About</Link>
      <BookButton location="home-nav" className={s.navCta} onClick={close}>Let’s talk <span aria-hidden="true">↗</span></BookButton>
    </nav>
  </header>;
}
