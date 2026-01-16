import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Test Page</h1>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col gap-4">
        <div className="p-6 bg-green-100 rounded-lg shadow text-center">
          <p className="text-lg mb-2">Authenticated!</p>
          <p className="font-bold">{session?.user?.email}</p>
          <p className="text-gray-500">Role: {(session?.user as any)?.role}</p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="rounded-full bg-black text-white px-6 py-2 hover:bg-gray-800 transition"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
