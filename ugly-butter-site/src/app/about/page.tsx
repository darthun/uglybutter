import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-yellow-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">About Ugly Butter</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <p className="mb-4">
          Ugly Butter is a fun community-driven platform where users can share and rate pictures of, well, ugly butter!
        </p>
        <p className="mb-4">
          Whether it's crumbs, oddly sculpted, or just plain unappealing, we shame all forms of butter in their inglorious states.
        </p>
        <p>
          Join our community, upload your ugliest butter pics, and vote on others. Let's spread the joy of imperfect dairy!
        </p>
      </div>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}