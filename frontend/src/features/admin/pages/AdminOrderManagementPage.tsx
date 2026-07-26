import { OrderFilters } from '@/features/store/components/OrderFilters';
import OrderListCard from '@/features/store/components/OrderListCard';
import useItemsPerPage from '@/features/store/hooks/useItemsPerPage';
import { useOrders } from '@/features/store/hooks/useOrders';
import { SEO } from '@/shared/common/SEO';
import { Pagination } from '@/shared/components/ui/Pagination';
import ContainerBackground from '@/shared/containers/ContainerBackground';
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';

export default function AdminOrderManagementPage() {

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Fetch all orders (filtering happens on frontend)
    const { orders, counts, isLoading, isError, error } = useAdminOrders({
        search,
        status: activeTab,
        dateFrom,
        dateTo,
    });

    // Build tabs with counts
    const tabs = [
        { label: 'All', value: 'all', count: counts.total },
        { label: 'New Orders', value: 'processing', count: counts.newOrders },
        { label: 'Out for Delivery / Ready for Pickup', value: 'out_for_delivery', count: counts.outForDelivery },
        { label: 'Completed', value: 'completed', count: counts.completed },
    ];

    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = useItemsPerPage();

    const filtered = useMemo(() => {
        return orders?.filter((orders) => {
            const searchMatch = orders.orderNumber
                .toLowerCase()
                .includes(search.toLowerCase());

            return searchMatch
        });
    }, [orders, search]);


    const totalPages = filtered ? Math.ceil(
        filtered?.length / ITEMS_PER_PAGE,
    ) : 0;

    if (isLoading) {
        return <ContainerBackground>
            <p className="">Loading orders...</p>
        </ContainerBackground>;
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-red-500">Error loading orders: {error?.message}</div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Order Management" />

            <ContainerBackground>
                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="type-section-title">
                            Order Management
                        </h1>

                        <p className="text-gray-600 max-w-xl">
                            Track, process, and manage merchandise orders.
                        </p>
                    </div>

                </div>

                <OrderFilters
                    variant="admin"
                    search={search}
                    onSearch={setSearch}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={tabs}
                    dateRange={{
                        from: dateFrom,
                        to: dateTo,
                        onFromChange: setDateFrom,
                        onToChange: setDateTo,
                    }}
                />

                <div className="mt-6 space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            {search.trim() ? 'No orders match your search' : 'No orders found'}
                        </p>
                    ) : (
                        orders.map((order) => (
                            <OrderListCard order={order} key={order.id} variant='admin' action={
                                <Link to={`/admin/orders/${order.id}`} className="border border-2 p-0.5 px-3 font-semibold rounded-2xl border-primary-500 text-primary-500">
                                    View Details
                                </Link>
                            } />
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="sticky bottom-0 mt-6 bg-[#F8F8F7] py-4">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </ContainerBackground>

        </>
    );
}
