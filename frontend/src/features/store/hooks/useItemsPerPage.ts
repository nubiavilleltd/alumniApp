import { useEffect, useState } from "react";

export default function useItemsPerPage() {
  const [items, setItems] = useState(12);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640)
        setItems(6); // mobile
      else if (window.innerWidth < 1024)
        setItems(8); // tablet
      else setItems(12); // desktop
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return items;
}