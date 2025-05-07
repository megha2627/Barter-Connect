import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          Barter Circle Connect
        </Link>
        <div>
          <Link href="/skills" className="mr-4">
            Skills
          </Link>
          <Link href="/profile" className="mr-4">
            Profile
          </Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
