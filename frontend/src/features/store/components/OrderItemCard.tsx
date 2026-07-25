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
        <div className="w-52 h-60 flex flex-col gap-4 justify-center border border-primary-200 rounded-2xl">
            <div className="overflow-hidden">
                <img
                    src={orderItem.image}
                    alt={orderItem.productName}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col p-4">
                <p className="text-base text-gray-600 leading-snug mb-2 line-clamp-2">
                    {orderItem.productName}
                </p>

                <p className="font-bold text-gray-900">
                    <span>₦{orderItem.price.toLocaleString()}</span>
                </p>
                <p className="text-base font-semibold text-gray-500">
                    ×{orderItem.quantity}
                </p>
                <p className="text-sm text-gray-900 min-h-[1.25rem]">
                    {variantDisplay}
                </p>
            </div>
        </div>
    )
}