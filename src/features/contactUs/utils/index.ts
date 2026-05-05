function toTelephoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function toGoogleMapsHref(addressLines: string[]) {
  const query = addressLines.filter(Boolean).join(', ').trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export { toTelephoneHref, toGoogleMapsHref };
