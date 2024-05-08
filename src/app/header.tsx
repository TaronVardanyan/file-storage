import { UserButton, OrganizationSwitcher, SignedOut, SignInButton } from "@clerk/nextjs";

const Header = () => {
    return <div className="border-b py-4 bg-gray-50">
        <div className="container mx-auto flex justify-between items-center">
            File Storage
            <div className="flex gap-2">
                <OrganizationSwitcher/>
                <UserButton />
                <SignedOut>
                    <SignInButton><button >sign in</button></SignInButton>
                </SignedOut>
            </div>
        </div>
    </div>
}

export default Header;