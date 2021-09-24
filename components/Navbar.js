import { useUser } from "@auth0/nextjs-auth0";
import React from "react";
import Link from "next/link";
export default function Navbar() {
  // const { user, isLoading } = useUser();
  return (
    <nav>
      <Link href="/">
        <a className="text-2xl mb-2 block text-center text-red-200 uppercase">
          D-n-D Code Snippets!
        </a>
      </Link>
    </nav>
  );
}
