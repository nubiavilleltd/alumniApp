import React from 'react'
import { OrderItem } from '../types/order.types'

type OrderItemCardProps = {
    orderItem: OrderItem
}

function getVariantsDisplay(item: OrderItem) {
    if (item.color && item.size) return `${item.color}/${item.size}`
    if (item.color) return item.color
    if (item.size) return item.size
}


export default function OrderItemCard({ orderItem }: OrderItemCardProps) {
    const variantDisplay = getVariantsDisplay(orderItem)
    return (
        <div className="w-full sm:w-52 min-w-0 flex-shrink-0 flex flex-row sm:flex-col border border-primary-200 rounded-2xl overflow-hidden">
            <div className="w-24 self-stretch sm:w-full sm:h-auto sm:aspect-[4/3] flex-shrink-0 overflow-hidden bg-gray-50">
                <img
                    src={orderItem.image}
                    alt={orderItem.productName}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col p-3 sm:p-4 min-w-0">
                <p className="text-sm sm:text-base text-gray-600 leading-snug mb-2 line-clamp-2">
                    {orderItem.productName}
                </p>

                <p className="font-bold text-gray-900 text-sm sm:text-base">
                    <span>₦{orderItem.price.toLocaleString()}</span>
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-500">
                    ×{orderItem.quantity}
                </p>
                <p className="text-sm text-gray-900 min-h-[1.25rem] truncate">
                    {variantDisplay}
                </p>
            </div>
        </div>
    )
}