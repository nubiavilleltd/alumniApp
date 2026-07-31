import React from 'react'
import { PropsWithChildren } from 'react'

export default function ContainerBackground({ children }: PropsWithChildren) {
    return (
        <section className="min-h-screen bg-[#F8F8F7] py-8">
            <div className="container-custom mx-auto">
                {children}

            </div>
        </section>
    )
}
