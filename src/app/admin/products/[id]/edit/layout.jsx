'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use } from 'react';

export default function EditProductLayout({ children, params }) {
  const { id } = use(params);
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', href: `/admin/products/${id}/edit` },
    { name: 'Details', href: `/admin/products/${id}/edit/details` },
    { name: 'Pricing', href: `/admin/products/${id}/edit/pricing` },
    { name: 'Inventory', href: `/admin/products/${id}/edit/inventory` },
    { name: 'Images', href: `/admin/products/${id}/edit/images` },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
          ← Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`
                    w-1/5 py-4 px-1 text-center border-b-2 text-sm font-medium
                    ${isActive 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
