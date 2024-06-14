import { UserButton, OrganizationSwitcher, SignedOut, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <div className="border-b bg-gray-50 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl">
          <Image src="/logo.png" width="50" height="50" alt="logo" />
          File Storage
        </Link>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <button>sign in</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
