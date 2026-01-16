import { signIn } from "@/auth";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Login Required</h1>
                <p className="text-gray-600">Please sign in with your @coralcap.co email</p>
            </div>

            <form
                action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/" });
                }}
            >
                <button
                    type="submit"
                    className="rounded-full bg-blue-600 text-white px-8 py-3 font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    Sign in with Google
                </button>
            </form>
        </div>
    );
}
