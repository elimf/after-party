"use client";

import { useRouter } from 'next/navigation';

const Welcome = (): JSX.Element => {
  const router = useRouter();

  const redirectToHome = (): void => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-blue-500 py-6 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-white">After Party</h1>
      <button
        onClick={redirectToHome}
        className="bg-white text-blue-500 hover:bg-blue-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Go to Home
      </button>
    </div>
  );
}

export default Welcome;
