import { Modal } from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';

import { useCartStore } from '../stores/useCartStore';
import { useProductModalStore } from '../stores/useProductModalStore';

import { useProductSelection } from '../hooks/useProductSelection';

import { ProductImageGallery } from './ProductImageGallery';
import { ProductColorSelector } from './ProductColorSelector';
import { ProductSizeSelector } from './ProductSizeSelector';
import { ProductQuantitySelector } from './ProductQuantitySelector';

export function ProductDetailsModal() {
  const { isOpen, close, product, mode, cartItem } =
    useProductModalStore();

  const addItem = useCartStore((s) => s.addItem);
  const updateItem = useCartStore((s) => s.updateItem);

  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    imageIndex,
    setImageIndex,
    activeVariant,
    sizes,
    maxStock,
  } = useProductSelection(product);

  if (!product) return null;

  const handleAddToCart = () => {
    const itemId =
      product.id +
      '-' +
      selectedColor +
      '-' +
      selectedSize;

    const payload = {
      id: itemId,
      productId: product.id,
      productName: product.name,
      image: activeVariant?.images?.[0] ?? '',
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
    };

    if (mode === 'edit' && cartItem) {
      updateItem(cartItem.id, payload);
    } else {
      addItem(payload);
    }

    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={product.name}
    >
      <div className="space-y-4">
        {/* IMAGE */}
        <ProductImageGallery
          variant={activeVariant}
          imageIndex={imageIndex}
          onChangeIndex={setImageIndex}
        />

        {/* COLOR */}
        <ProductColorSelector
          variants={product.variants}
          selected={selectedColor}
          onChange={setSelectedColor}
        />

        {/* SIZE */}
        {product.hasSizes && (
          <ProductSizeSelector
            sizes={sizes}
            selected={selectedSize}
            onChange={setSelectedSize}
          />
        )}

        {/* QTY */}
        <ProductQuantitySelector
          value={quantity}
          max={maxStock || 99}
          onChange={setQuantity}
        />

        <Button
          onClick={handleAddToCart}
          disabled={maxStock === 0}
          className="w-full"
        >
          {mode === 'edit'
            ? 'Update Cart'
            : 'Add to Cart'}
        </Button>
      </div>
    </Modal>
  );
}