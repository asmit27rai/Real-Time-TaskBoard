import { SignInButton } from "@clerk/clerk-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center px-4">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          TaskSpark 🔥
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto text-slate-300">
          Real-time task management powered by WebSockets & MongoDB Change Streams.
          Collaborate, update, and conquer your goals instantly.
        </p>
      </header>

      <div className="mt-10">
        <button
          className="px-8 py-3 rounded-xl text-lg font-semibold bg-white text-black hover:bg-slate-200 transition-all duration-300 shadow-xl"
        >
            <SignInButton>
                Sign In
            </SignInButton>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;