// features/user/components/ui/ProfileAddressCard.tsx
//
// Sidebar address card shared by UserProfilePage and AlumniProfilePage.
// Renders address fields in the sidebar below the ProfileCard.
// Hidden on mobile (shows in ProfileInfoPanel instead via the mobile Address section).
//
// Props are all optional — render nothing if no address data.

interface ProfileAddressCardProps {
  streetAddress?: string;
  area?: string;
  state?: string;
  city?: string;
  zone?: string;
}

type AddressField = { label: string; value: string | undefined };

export function ProfileAddressCard({
  streetAddress,
  area,
  state,
  city,
  zone,
}: ProfileAddressCardProps) {
  const fields: AddressField[] = [
    { label: 'Street', value: streetAddress },
    { label: 'Area', value: area },
    // { label: 'State', value: state },
    { label: 'City', value: city },
    { label: 'Zone', value: zone },
  ].filter((f) => f.value);

  //   if (fields.length === 0) return null;

  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Address</h3>
      <div className="space-y-2 text-sm text-gray-600">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-3">
            <span className="text-gray-400 whitespace-nowrap">{label}:</span>
            <span className="break-words">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
