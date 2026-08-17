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
  city,
  zone,
}: ProfileAddressCardProps) {
  const fields: AddressField[] = [
    { label: 'Street', value: streetAddress },
    { label: 'Area', value: area },
    { label: 'City', value: city },
    { label: 'Zone', value: zone },
  ].filter((f) => f.value);

  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Address</h3>
      <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-baseline">
        {fields.map(({ label, value }) => (
          <>
            <span key={`${label}-label`} className="text-gray-900 whitespace-nowrap">
              {label}:
            </span>
            {/* <span key={`${label}-value`} className="text-gray-600 truncate" title={value}> */}
            <span key={`${label}-value`} className="text-gray-600" title={value}>
              {value}
            </span>
          </>
        ))}
      </div>
    </div>
  );
}
