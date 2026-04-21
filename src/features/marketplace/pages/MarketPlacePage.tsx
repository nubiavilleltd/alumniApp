// features/marketplace/pages/MarketPlacePage.tsx

import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { Button } from '@/shared/components/ui/Button';
import { PostBusinessModal } from '../components/PostYourBusinessModal';
import EmptyState from '@/shared/components/ui/EmptyState';
import {
  useMarketplace,
  useMarketplaceCategories,
} from '@/features/marketplace/hooks/useMarketplace';
import type { Business } from '../types/marketplace.types';
import { useStartDirectConversation } from '@/features/messages/hooks/useStartDirectConversation';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function BusinessCardSkeleton() {
  return (
    <div className="marketplace-card marketplace-card--skeleton" aria-hidden="true">
      <div className="marketplace-card__image-wrap marketplace-skeleton-block" />
      <div className="marketplace-card__body">
        <div className="marketplace-card__seller-row">
          <div className="marketplace-card__avatar marketplace-skeleton-block" />
          <div className="marketplace-card__seller-copy">
            <div className="marketplace-skeleton-line marketplace-skeleton-line--title" />
            <div className="marketplace-skeleton-line marketplace-skeleton-line--short" />
          </div>
        </div>
        <div className="marketplace-skeleton-line" />
        <div className="marketplace-skeleton-line marketplace-skeleton-line--wide" />
        <div className="marketplace-skeleton-line marketplace-skeleton-line--mid" />
        <div className="marketplace-card__details">
          <div className="marketplace-skeleton-line marketplace-skeleton-line--detail" />
          <div className="marketplace-skeleton-line marketplace-skeleton-line--detail" />
          <div className="marketplace-skeleton-line marketplace-skeleton-line--detail" />
        </div>
      </div>
    </div>
  );
}

function formatCategoryLabel(category: string) {
  return category
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getOwnerInitials(ownerName: string) {
  const parts = ownerName.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || '?';
}

function getWebsiteHref(website: string) {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

// ─── Business Card ────────────────────────────────────────────────────────────
function BusinessCard({
  business,
  currentUserMemberId,
  onMessageClick,
  isMessagePending,
}: {
  business: Business;
  currentUserMemberId?: string;
  onMessageClick: (business: Business) => void;
  isMessagePending: boolean;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const isOwnBusiness = business.ownerId === currentUserMemberId;
  const navigate = useNavigate();
  const profileHref = ALUMNI_ROUTES.PROFILE(business.ownerId);
  const ownerInitials = getOwnerInitials(business.owner);

  const openOwnerProfile = () => {
    navigate(profileHref);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openOwnerProfile();
    }
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i === 0 ? business.images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i === business.images.length - 1 ? 0 : i + 1));
  };

  return (
    <article
      className="marketplace-card"
      role="link"
      tabIndex={0}
      aria-label={`View ${business.owner}'s profile`}
      onClick={openOwnerProfile}
      onKeyDown={handleCardKeyDown}
    >
      {/* Image carousel */}
      <div className="marketplace-card__image-wrap group">
        {business.images.length > 0 ? (
          <img
            src={business.images[imgIndex]}
            alt={business.name}
            className="marketplace-card__image"
            loading="lazy"
          />
        ) : (
          <div className="marketplace-card__image-placeholder">
            <Icon icon="mdi:storefront-outline" className="marketplace-card__placeholder-icon" />
          </div>
        )}
        {business.images.length > 1 && (
          <>
            <button
              type="button"
              aria-label={`Previous image for ${business.name}`}
              onClick={prev}
              className="marketplace-card__carousel marketplace-card__carousel--prev"
            >
              <Icon icon="mdi:chevron-left" />
            </button>
            <button
              type="button"
              aria-label={`Next image for ${business.name}`}
              onClick={next}
              className="marketplace-card__carousel marketplace-card__carousel--next"
            >
              <Icon icon="mdi:chevron-right" />
            </button>
          </>
        )}
        <span className="marketplace-card__category">{formatCategoryLabel(business.category)}</span>
      </div>

      {/* Info */}
      <div className="marketplace-card__body">
        <div className="marketplace-card__seller-row">
          <div className="marketplace-card__avatar-wrap">
            <div className="marketplace-card__avatar" aria-hidden="true">
              <span>{ownerInitials}</span>
            </div>
          </div>
          <div className="marketplace-card__seller-copy">
            <h3 className="marketplace-card__title">{business.name}</h3>
            <p className="marketplace-card__owner">{business.owner}</p>
          </div>
        </div>

        <p className="marketplace-card__description">{business.description}</p>

        {business.website && (
          <div className="marketplace-card__details">
            <a
              href={getWebsiteHref(business.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="marketplace-card__detail marketplace-card__detail--link"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon="mdi:web" />
              <span>{business.website}</span>
            </a>
          </div>
        )}

        <div className="marketplace-card__actions" aria-label={`Contact ${business.name}`}>
          {business.website && (
            <a
              href={getWebsiteHref(business.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="marketplace-card__icon-action"
              aria-label={`Visit ${business.name} website`}
              onClick={(event) => event.stopPropagation()}
            >
              <Icon icon="mdi:web" />
            </a>
          )}
          <Button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMessageClick(business);
            }}
            disabled={isOwnBusiness || isMessagePending}
            loading={isMessagePending}
            leftIcon={isMessagePending ? undefined : 'mdi:message-outline'}
            className="marketplace-card__message-button"
          >
            <span>{isMessagePending ? 'Opening...' : 'Send Message'}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 9;

export default function MarketPlacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showPostModal, setShowPostModal] = useState(false);
  const [pendingBusinessId, setPendingBusinessId] = useState<string | null>(null);
  const currentUser = useIdentityStore((state) => state.user);
  const { startDirectConversation, isPending: isStartingConversation } =
    useStartDirectConversation();

  const { data: businesses = [], isLoading, error } = useMarketplace();
  const { data: categoriesList = [] } = useMarketplaceCategories();

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return businesses.filter((b) => {
      const matchesSearch =
        !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
      const matchesCategory = !category || b.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [businesses, searchTerm, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  async function handleStartBusinessConversation(business: Business) {
    setPendingBusinessId(business.businessId);
    await startDirectConversation({
      participantMemberId: business.ownerId,
      topic: `Marketplace enquiry about ${business.name}`,
      draftMessage: `Hi, I'm interested in ${business.name}. I'd like to know more about your services.`,
      marketplaceBusinessId: business.businessId,
      recipientProfile: {
        fullName: business.owner,
        headline: `Owner of ${business.name}`,
        location: business.location,
        profileHref: `/alumni/profiles/${business.ownerId}`,
      },
    });
    setPendingBusinessId((current) => (current === business.businessId ? null : current));
  }

  return (
    <>
      <SEO
        title="Marketplace"
        description="Discover and support businesses owned by Our Sisters."
      />

      <main className="marketplace-page">
        <section className="marketplace-shell">
          <div className="marketplace-header">
            <div>
              <h1 className="marketplace-title">Marketplace</h1>
              <p className="marketplace-subtitle">
                <span>Discover and support businesses owned by</span>
                <span> our sisters</span>
              </p>
            </div>

            {currentUser && (
              <Button
                type="button"
                onClick={() => setShowPostModal(true)}
                rightIcon="mdi:plus"
                className="marketplace-post-button"
              >
                Post Your Business
              </Button>
            )}
          </div>

          <div className="marketplace-toolbar">
            <label className="marketplace-search" htmlFor="marketplace-search">
              <Icon icon="mdi:magnify" />
              <input
                id="marketplace-search"
                type="search"
                value={searchTerm}
                onChange={(event) => handleFilterChange(setSearchTerm)(event.target.value)}
                placeholder="Search here"
              />
            </label>

            <label className="marketplace-category" htmlFor="marketplace-category">
              <select
                id="marketplace-category"
                aria-label="Filter by Category"
                value={category}
                onChange={(event) => handleFilterChange(setCategory)(event.target.value)}
              >
                <option value="">Filter by Category</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryLabel(cat)}
                  </option>
                ))}
              </select>
              <Icon icon="mdi:chevron-down" />
            </label>
          </div>

          {/* Error State */}
          {error && (
            <div className="marketplace-feedback">
              <Icon icon="mdi:alert-circle-outline" />
              <p>Failed to load businesses. Please try again later.</p>
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="marketplace-grid">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : !error && visible.length > 0 ? (
            <div className="marketplace-grid">
              {visible.map((business) => (
                <BusinessCard
                  key={business.businessId}
                  business={business}
                  currentUserMemberId={currentUser?.memberId}
                  onMessageClick={handleStartBusinessConversation}
                  isMessagePending={
                    isStartingConversation && pendingBusinessId === business.businessId
                  }
                />
              ))}
            </div>
          ) : !error && visible.length === 0 ? (
            <EmptyState
              icon="mdi:storefront-outline"
              title="No businesses found"
              description="Try adjusting your search or be the first to list your business."
              actionLabel={currentUser ? 'Post Your Business' : ''}
              onAction={() => setShowPostModal(true)}
            />
          ) : null}

          {/* Load More */}
          {hasMore && !isLoading && !error && (
            <div className="marketplace-load-more">
              <Button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="marketplace-load-more__button"
              >
                Load More Businesses
              </Button>
            </div>
          )}
        </section>
      </main>

      <PostBusinessModal isOpen={showPostModal} onClose={() => setShowPostModal(false)} />
    </>
  );
}
