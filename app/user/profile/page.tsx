import { auth } from "@/auth";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

const Profile = async () => {
  const session = await auth();
  return (
    <>
      {/* SessionProvider allows us to use hook in a client component */}
      <SessionProvider session={session}>
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="h2-bold">Profile</h2>
          <ProfileForm />
          {/* {session?.user?.name} */}
        </div>
      </SessionProvider>
    </>
  );
};

export default Profile;
