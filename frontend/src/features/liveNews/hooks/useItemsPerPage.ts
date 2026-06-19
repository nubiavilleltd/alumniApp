import { useEffect, useState } from "react";

export default function useItemsPerPage() {
  const [items, setItems] = useState(9);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) {
        setItems(8);
      } else if (window.innerWidth < 1024) {
        setItems(8);
      } else {
        setItems(8);
      }
    };

    update();

    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  return items;
}