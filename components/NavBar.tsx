import { auth, signIn, signOut } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const NavBar = async () => {
  const session = await auth();
  console.log('session', session);

  return (
    <header className='bg-white px-5 py-3 font-work-sans shadow-sm'>
      <nav className='flex items-center justify-between'>
        <Link href={`/`}>
          <Image src={`/logo.png`} alt='logo' width={144} height={30} />
        </Link>
        <div className='flex items-center gap-5 text-black'>
          {session && session?.user ? (
            <>
              <Link href={`/startup/create`}>
                <span>Create</span>
              </Link>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button type='submit'>Logout</button>
              </form>
              <Link href={`/user/${session?.id}`}>
                <span>{session?.user.name}</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                'use server';
                await signIn('github');
              }}
            >
              <button type='submit'>
                <span>Login</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
