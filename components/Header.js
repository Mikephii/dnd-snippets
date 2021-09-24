import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function Header({ title, subtitle }) {
  return (
    <header className="my-12">
      <h1 className="text-blue-100 text-2xl">{title}</h1>
      {subtitle && <p className="text-red-100">{subtitle}</p>}

      <Link href="/new">
        <a className="mt-3 inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create New Code Snippet
        </a>
      </Link>
    </header>
  );
}
