import { SEO } from '@/shared/common/SEO'
import ContainerBackground from '@/shared/containers/ContainerBackground'
import React, { useMemo, useState } from 'react'
import useItemsPerPage from '../hooks/useItemsPerPage';
import { useOrders } from '../hooks/useOrders';
import { Pagination } from '@/shared/components/ui/Pagination';
import { OrderFilters } from '../components/OrderFilters';
import OrderListCard from '../components/OrderListCard';
import { Link } from 'react-router-dom';

export default function OrderHistoryPage() {


    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Fetch all orders (filtering happens on frontend)
    const { orders, counts, isLoading, isError, error } = useOrders({
        search,
        status: activeTab,
    });

    // Build tabs with counts
    const tabs = [
        { label: 'All', value: 'all', count: counts.total },
        { label: 'Processing', value: 'processing', count: counts.processing },
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
            <SEO title="My Odrder History" />

            <ContainerBackground>
                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="type-section-title">
                            My Order History
                        </h1>

                        {/* <p className="text-gray-600 max-w-xl">
                                  Celebrate your connection to the alumnae
                                  community with exclusive merchandise.
                              </p> */}
                    </div>

                </div>


                <OrderFilters
                    variant="user"
                    search={search}
                    onSearch={setSearch}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={tabs}
                />

                <div className="mt-6 space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            {search.trim() ? 'No orders match your search' : 'No orders found'}
                        </p>
                    ) : (
                        orders.map((order) => (
                            <OrderListCard order={order} key={order.id} action={
                                <Link to={`/orders/${order.id}`} className="border border-2 p-0.5 px-3 font-semibold rounded-2xl border-primary-500 text-primary-500">
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
