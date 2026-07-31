// // /feature/store/components/orders/OrderListCard.tsx
import React from 'react'
import { Order } from '../types/order.types'
import { OrderStatusBadge } from './OrderStatusBadge'
import OrderItemCard from './OrderItemCard'
import CopyButton from '@/shared/components/ui/CopyButton'

type OrderListCardProps = {
    variant?: 'user' | 'admin';
    order: Order
    action?: React.ReactNode
}

export default function OrderListCard({ order, action }: OrderListCardProps) {
    const formattedDate = new Date(order.placedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })


    return (
        // <div className="bg-white rounded-2xl p-7">
        <div className="bg-white rounded-2xl p-4 sm:p-7">
            {/* <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-200"> */}
            <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{formattedDate}</span>
                    {order.customerFullName && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-700">{order.customerFullName}</span>
                        </>
                    )}
                    {order.customerEmail && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">{order.customerEmail}</span>
                        </>
                    )}
                </div>

                {/* <div className="flex items-center gap-5">
                    <div className='flex gap-1'>          <span className="text-sm text-gray-500">
                        Order Number: <span className="text-gray-700">{order.orderNumber || ""}</span>
                    </span>

                        <CopyButton value={order.orderNumber}/>
                    </div>
          
                    {action}
                </div> */}

                <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-5">
                    <div className="flex items-start gap-1">
                        <span className="text-sm text-gray-500 break-all">
                            Order Number: <span className="text-gray-700">{order.orderNumber || ""}</span>
                        </span>
                        <CopyButton value={order.orderNumber} />
                    </div>

                    {action && <div className="w-full sm:w-auto">{action}</div>}
                </div>
            </div>

            {/* <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-5">
                    {order.items.map((item) => (
                        <OrderItemCard key={item.id} orderItem={item} />
                    ))}
                </div>
                <p className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                    Total: ₦{order.total.toLocaleString()}
                </p>
            </div> */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-5">
                    {order.items.map((item) => (
                        <OrderItemCard key={item.id} orderItem={item} />
                    ))}
                </div>
                <p className="text-lg font-semibold text-gray-900 sm:whitespace-nowrap">
                    Total: ₦{order.total.toLocaleString()}
                </p>
            </div>
        </div>
    )
}
