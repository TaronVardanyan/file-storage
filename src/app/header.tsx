import { UserButton, OrganizationSwitcher, SignedOut, SignInButton } from '@clerk/nextjs';

const Header = () => {
  return (
    <div className="border-b bg-gray-50 py-4">
      <div className="container mx-auto flex items-center justify-between">
        File Storage
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
