"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const contracts = [
    { name: "Lottery", path: "/admin/lottery" },
    { name: "Roulette", path: "/admin/roulette" },
    { name: "flip", path: "/admin/flip" },
    // Add more contracts here
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <nav>
          <ul>
            {contracts.map((contract) => (
              <li key={contract.path} className="mb-2">
                <Link
                  href={contract.path}
                  className={`block p-2 rounded ${
                    pathname === contract.path ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {contract.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
