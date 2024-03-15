"use client";
import { QueryClientProvider, QueryClient } from 'react-query';
const queryClient = new QueryClient();
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return    <div className="flex items-center justify-center h-screen">
                  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
              </div>
  }