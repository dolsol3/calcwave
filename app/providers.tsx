// app/providers.tsx
'use client'

import React from 'react'; 
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const navigation = useRouter();

  return (
    <NextUIProvider navigate={navigation.push}>
      {children}
    </NextUIProvider>
  )
}