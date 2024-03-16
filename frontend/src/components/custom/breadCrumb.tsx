"use client"
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { usePathname } from 'next/navigation'

const AutoBreadcrumb = () => {
  const pathSegments = usePathname().split('/').filter((segment) => segment !== '');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
            <Link className='[&>svg]:size-3.5 transition-colors hover:text-foreground' href="/">Home</Link>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
                {index === pathSegments.length - 1 ? (
                <span>{segment}</span>
                ) : (
                  <Link className='[&>svg]:size-3.5 transition-colors hover:text-foreground' href={`/${pathSegments.slice(0, index + 1).join('/')}`}>{segment}</Link>
                )}
            </BreadcrumbItem>
            </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AutoBreadcrumb;