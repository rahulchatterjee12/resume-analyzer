import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import ProfileClient from "@/components/shared/ProfileClient";

export default async function ProfilePage() {
  // 1. Get the secure session from NextAuth
  const session = await getServerSession(authOptions);

  // 2. If not logged in, boot them to the login page
  if (!session) {
    redirect("/login");
  }

  // 3. Fetch fresh user data from MongoDB
  await dbConnect();
  const dbUser = await User.findById(session.user.id).lean();

  if (!dbUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-950 font-sans text-zinc-100">
        <div className="glass-card p-8 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="font-semibold text-white">Error loading profile data.</p>
        </div>
      </div>
    );
  }

  // Serialize for client component
  const serializedUser = {
    name: dbUser.name,
    email: dbUser.email,
    credits: dbUser.credits,
    subscriptionStatus: dbUser.subscriptionStatus,
    createdAt: dbUser.createdAt?.toISOString?.() || dbUser.createdAt,
  };

  return <ProfileClient dbUser={serializedUser} />;
}
