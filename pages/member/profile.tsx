import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });
  return <>{session?.user ? <div>Member Profile</div> : <div>No Profile</div>}</>;
};

export default Profile;
