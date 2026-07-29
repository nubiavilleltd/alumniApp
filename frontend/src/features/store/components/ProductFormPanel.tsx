
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2, X, ChevronRight, Cloud, CloudUpload } from 'lucide-react';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import Button from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import { AdminApiProduct, ColourEntry, CreateProductFormData, FormImage, SizeEntry, StockCell, UpdateProductFormData, VariantPayloadItem } from '@/features/admin/types/adminStore.types';
import { BasicInfoFormValues, basicInfoSchema, STORE_CATEGORIES } from '@/features/admin/schemas/adminStore.schema';
import { eventFormFieldLabelClassName, eventFormSelectClassName, eventFormSelectControlClassName, eventFormUploadDropzoneClassName } from '@/features/events/constants/eventFormStyles';



// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatWithCommas(digits: string): string {
  if (!digits) return '';
  const [intPart, decPart] = digits.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

function sanitizePriceInput(value: string): string {
  let cleaned = value.replace(/,/g, '').replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
}

function digitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

// ─── Stock Matrix ─────────────────────────────────────────────────────────────

interface StockMatrixProps {
  colours: ColourEntry[];
  sizes: SizeEntry[];
  hasColor: boolean;
  hasSize: boolean;
  cells: StockCell[];
  onChange: (cells: StockCell[]) => void;
}

function StockMatrix({ colours, sizes, hasColor, hasSize, cells, onChange }: StockMatrixProps) {
  const [localVals, setLocalVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    cells.forEach((c) => {
      init[`${c.color}__${c.size}`] = c.quantity > 0 ? String(c.quantity) : '';
    });
    return init;
  });

  const getLocal = (color: string, size: string) =>
    localVals[`${color}__${size}`] ?? '';

  const setLocal = (color: string, size: string, raw: string) => {
    const cleaned = digitsOnly(raw);
    const key = `${color}__${size}`;
    setLocalVals((prev) => ({ ...prev, [key]: cleaned }));
    const qty = cleaned === '' ? 0 : parseInt(cleaned, 10);
    const next = cells.filter((c) => !(c.color === color && c.size === size));
    next.push({ color, size, quantity: isNaN(qty) ? 0 : qty });
    onChange(next);
  };

  const cellClass =
    'w-14 h-10 text-center border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary-400 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

  // Colour only — horizontal row
  if (hasColor && !hasSize) {
    return (
      <div>
        <p className="text-sm text-gray-600 mb-4">Enter the stock quantity for each colour</p>
        <div className="flex flex-wrap gap-6">
          {colours.map((c) => (
            <div key={c.colorName} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-600">{c.colorName}</span>
              <input
                type="text"
                inputMode="numeric"
                value={getLocal(c.colorName, 'One Size')}
                onChange={(e) => setLocal(c.colorName, 'One Size', e.target.value)}
                className={cellClass}
                style={{ backgroundColor: '#F8F7F4' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Size only — horizontal row
  if (!hasColor && hasSize) {
    return (
      <div>
        <p className="text-sm text-gray-600 mb-4">Enter the stock quantity for each size</p>
        <div className="flex flex-wrap gap-6">
          {sizes.map((s) => (
            <div key={s.sizeName} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-600">{s.sizeName}</span>
              <input
                type="text"
                inputMode="numeric"
                value={getLocal('Default', s.sizeName)}
                onChange={(e) => setLocal('Default', s.sizeName, e.target.value)}
                className={cellClass}
                style={{ backgroundColor: '#F8F7F4' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Both colour and size — full matrix
  return (
    <div className="overflow-x-auto">
      <p className="text-sm text-gray-600 mb-4">
        Enter the stock quantity for each colour and corresponding size
      </p>
      <table className="text-sm border-separate border-spacing-y-0.5">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-8 w-28" />
            {sizes.map((s) => (
              <th
                key={s.sizeName}
                className="text-center text-xs font-semibold text-gray-500 pb-3 px-3 min-w-[56px]"
              >
                {s.sizeName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colours.map((c) => (
            <tr key={c.colorName}>
              <td className="text-xs font-semibold text-gray-700 pr-8 py-1">{c.colorName}</td>
              {sizes.map((s) => (
                <td key={s.sizeName} className="px-3 py-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={getLocal(c.colorName, s.sizeName)}
                    onChange={(e) => setLocal(c.colorName, s.sizeName, e.target.value)}
                    className={cellClass}
                    style={{ backgroundColor: '#F8F7F4' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductFormPanelProps {
  mode: 'create' | 'edit';
  existingProduct?: AdminApiProduct;
  isSubmitting: boolean;
  onSubmit: (data: CreateProductFormData | UpdateProductFormData) => void;
  onCancel: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductFormPanel({
  mode,
  existingProduct,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormPanelProps) {
  const [showMatrix, setShowMatrix] = useState(false);

  // ── Basic info form ────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit: handleBasicSubmit,
    setValue: setBasicValue,
    watch: watchBasic,
    formState: { errors: basicErrors },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    mode: 'onChange',
    defaultValues: {
      productName: existingProduct?.product_name ?? '',
      category: existingProduct?.category ?? '',
      price: existingProduct?.price ?? '',
      description: existingProduct?.description ?? '',
    },
  });

  // ── Images ─────────────────────────────────────────────────────────────────
  const [images, setImages] = useState<FormImage[]>(() => {
    if (mode === 'edit' && existingProduct) {
      return existingProduct.images.map((img) => ({
        key: makeKey(),
        url: img.image_url,
        existingId: img.id,
        isSpotlight: img.is_spotlight,
      }));
    }
    return [];
  });

  const addImages = (files: File[], urls: string[]) => {
    const newImgs: FormImage[] = files.map((file, i) => ({
      key: makeKey(),
      url: urls[i],
      file,
      isSpotlight: false,
    }));
    setImages((prev) => {
      const next = [...prev, ...newImgs];
      if (!next.some((img) => img.isSpotlight) && next.length > 0) {
        next[0] = { ...next[0], isSpotlight: true };
      }
      return next;
    });
  };

  const removeImage = (key: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.key === key);
      const next = prev.filter((img) => img.key !== key);
      if (!next.some((img) => img.isSpotlight) && next.length > 0) {
        next[0] = { ...next[0], isSpotlight: true };
      }
      if (removed) {
        setColours((cols) =>
          cols.map((c) =>
            c.imageUrl === removed.url ? { ...c, imageUrl: '', existingImageId: undefined } : c,
          ),
        );
      }
      return next;
    });
  };

  const setSpotlight = (key: string) => {
    setImages((prev) => prev.map((img) => ({ ...img, isSpotlight: img.key === key })));
  };

  const imagePreviews = images.map((img) => img.url);

  const handleGalleryChange = (
    files: File[],
    previews: string[],
    change?: { type: 'replace' } | { type: 'remove'; index: number },
  ) => {
    if (files.length > 0) {
      addImages(files, previews);
    } else if (change?.type === 'remove') {
      const removed = images[change.index];
      if (removed) removeImage(removed.key);
    }
  };

  // ── Variant toggles ────────────────────────────────────────────────────────
  const [hasVariants, setHasVariants] = useState(
    mode === 'edit'
      ? (existingProduct?.has_color || existingProduct?.has_size) ?? false
      : false,
  );
  const [hasColor, setHasColor] = useState(existingProduct?.has_color ?? false);
  const [hasSize, setHasSize] = useState(existingProduct?.has_size ?? false);
  const [noVariantQtyStr, setNoVariantQtyStr] = useState<string>(
    existingProduct?.quantity && existingProduct.quantity !== 'null'
      ? existingProduct.quantity
      : '',
  );

  // ── Colours ────────────────────────────────────────────────────────────────
  const [colours, setColours] = useState<ColourEntry[]>(() => {
    if (mode === 'edit' && existingProduct?.has_color) {
      const imageMap = new Map(existingProduct.images.map((img) => [img.id, img.image_url]));
      const seen = new Set<string>();
      const result: ColourEntry[] = [];
      for (const v of existingProduct.variants) {
        if (!v.color || seen.has(v.color)) continue;
        seen.add(v.color);
        const imgUrl = v.image_id ? (imageMap.get(v.image_id) ?? '') : '';
        result.push({ colorName: v.color, imageUrl: imgUrl, existingImageId: v.image_id ?? undefined });
      }
      return result;
    }
    return [];
  });

  const [colourInput, setColourInput] = useState('');
  const [selectedColourImageKey, setSelectedColourImageKey] = useState<string | null>(null);
  const [editingColourIndex, setEditingColourIndex] = useState<number | null>(null);
  const pendingNewUrl = useRef<string | null>(null);

  useEffect(() => {
    if (pendingNewUrl.current) {
      const found = images.find((img) => img.url === pendingNewUrl.current);
      if (found) {
        setSelectedColourImageKey(found.key);
        pendingNewUrl.current = null;
      }
    }
  }, [images]);

  const handleColourSectionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    pendingNewUrl.current = url;
    addImages([file], [url]);
    if (e.target) e.target.value = '';
  };

  const commitColour = () => {
    const name = colourInput.trim();
    if (!name) { toast.error('Please enter a colour name.'); return; }
    const selectedImg = images.find((img) => img.key === selectedColourImageKey);
    if (!selectedImg) { toast.error('Please select an image for this colour.'); return; }

    const entry: ColourEntry = {
      colorName: name,
      imageUrl: selectedImg.url,
      existingImageId: selectedImg.existingId,
    };

    if (editingColourIndex !== null) {
      setColours((prev) => prev.map((c, i) => (i === editingColourIndex ? entry : c)));
      setEditingColourIndex(null);
    } else {
      if (colours.some((c) => c.colorName.toLowerCase() === name.toLowerCase())) {
        toast.error(`Colour "${name}" already added.`); return;
      }
      setColours((prev) => [...prev, entry]);
    }
    setColourInput('');
    setSelectedColourImageKey(null);
  };

  const startEditColour = (index: number) => {
    const entry = colours[index];
    setColourInput(entry.colorName);
    const img = images.find((img) => img.url === entry.imageUrl);
    setSelectedColourImageKey(img?.key ?? null);
    setEditingColourIndex(index);
  };

  const deleteColour = (index: number) => {
    const name = colours[index].colorName;
    setColours((prev) => prev.filter((_, i) => i !== index));
    setStockCells((prev) => prev.filter((c) => c.color !== name));
  };

  // ── Sizes ──────────────────────────────────────────────────────────────────
  const [sizes, setSizes] = useState<SizeEntry[]>(() => {
    if (mode === 'edit' && existingProduct?.has_size) {
      const seen = new Set<string>();
      existingProduct.variants.forEach((v) => {
        if (v.size && !seen.has(v.size)) seen.add(v.size);
      });
      return [...seen].map((s) => ({ sizeName: s }));
    }
    return [];
  });

  const [sizeInput, setSizeInput] = useState('');
  const [editingSizeIndex, setEditingSizeIndex] = useState<number | null>(null);

  const commitSize = () => {
    const name = sizeInput.trim();
    if (!name) { toast.error('Please enter a size.'); return; }

    if (editingSizeIndex !== null) {
      const oldName = sizes[editingSizeIndex].sizeName;
      if (
        name.toLowerCase() !== oldName.toLowerCase() &&
        sizes.some((s) => s.sizeName.toLowerCase() === name.toLowerCase())
      ) {
        toast.error(`Size "${name}" already added.`); return;
      }
      setSizes((prev) => prev.map((s, i) => (i === editingSizeIndex ? { sizeName: name } : s)));
      setStockCells((prev) => prev.map((c) => (c.size === oldName ? { ...c, size: name } : c)));
      setEditingSizeIndex(null);
    } else {
      if (sizes.some((s) => s.sizeName.toLowerCase() === name.toLowerCase())) {
        toast.error(`Size "${name}" already added.`); return;
      }
      setSizes((prev) => [...prev, { sizeName: name }]);
    }
    setSizeInput('');
  };

  const startEditSize = (index: number) => {
    setSizeInput(sizes[index].sizeName);
    setEditingSizeIndex(index);
  };

  const cancelEditSize = () => {
    setSizeInput('');
    setEditingSizeIndex(null);
  };

  const deleteSize = (index: number) => {
    const name = sizes[index].sizeName;
    setSizes((prev) => prev.filter((_, i) => i !== index));
    setStockCells((prev) => prev.filter((c) => c.size !== name));
    if (editingSizeIndex === index) { setSizeInput(''); setEditingSizeIndex(null); }
  };

  // ── Stock matrix ───────────────────────────────────────────────────────────
  const [stockCells, setStockCells] = useState<StockCell[]>(() => {
    if (mode === 'edit' && existingProduct) {
      return existingProduct.variants.map((v) => ({
        color: v.color ?? 'Default',
        size: v.size ?? 'One Size',
        quantity: parseInt(v.quantity, 10) || 0,
      }));
    }
    return [];
  });

  // ── Next button logic ──────────────────────────────────────────────────────
  const variantItemsAdded =
    (!hasColor || colours.length > 0) &&
    (!hasSize || sizes.length > 0) &&
    (hasColor || hasSize);

  const nextEnabled = !hasVariants || variantItemsAdded;

  // ── Build payload and submit ───────────────────────────────────────────────
  const buildAndSubmit = () => {
    const basicValues = {
      productName: watchBasic('productName'),
      category: watchBasic('category'),
      price: watchBasic('price'),
      description: watchBasic('description'),
    };

    const newFiles = images.filter((img) => img.file).map((img) => img.file!);
    const spotlightImg = images.find((img) => img.isSpotlight) ?? images[0];
    const spotlightIsNew = !!spotlightImg?.file;
    const spotlightNewIndex = spotlightIsNew
      ? newFiles.findIndex((f) => f === spotlightImg?.file)
      : undefined;

    const effectiveColours = hasColor
      ? colours
      : [{ colorName: 'Default', imageUrl: '', existingImageId: undefined }];
    const effectiveSizes = hasSize ? sizes : [{ sizeName: 'One Size' }];

    let variants: VariantPayloadItem[] = [];
    if (hasVariants && (hasColor || hasSize)) {
      for (const c of effectiveColours) {
        for (const s of effectiveSizes) {
          const qty =
            stockCells.find((cell) => cell.color === c.colorName && cell.size === s.sizeName)
              ?.quantity ?? 0;
          const item: VariantPayloadItem = { quantity: qty };
          if (hasColor) item.color = c.colorName;
          if (hasSize) item.size = s.sizeName;
          if (hasColor) {
            if (c.existingImageId) {
              item.image_id = parseInt(c.existingImageId, 10);
            } else {
              const colourImg = images.find((img) => img.url === c.imageUrl);
              if (colourImg?.file) {
                const idx = newFiles.findIndex((f) => f === colourImg.file);
                if (idx >= 0) item.image_index = idx;
              }
            }
          }
          variants.push(item);
        }
      }
    }

    if (mode === 'create') {
      const allFiles = images.map((img) => img.file!).filter(Boolean);
      const spotlightIdx = images.findIndex((img) => img.isSpotlight);
      const data: CreateProductFormData = {
        productName: basicValues.productName,
        category: basicValues.category,
        price: basicValues.price,
        description: basicValues.description,
        hasColor: hasVariants && hasColor,
        hasSize: hasVariants && hasSize,
        quantity: hasVariants ? undefined : parseInt(noVariantQtyStr, 10) || 0,
        imageFiles: allFiles,
        spotlightIndex: spotlightIdx >= 0 ? spotlightIdx : 0,
        variants,
      };
      onSubmit(data);
    } else {
      const deleteIds = existingProduct
        ? existingProduct.images
          .filter((img) => !images.some((fi) => fi.existingId === img.id))
          .map((img) => img.id)
        : [];
      const data: UpdateProductFormData = {
        productId: existingProduct!.id,
        productName: basicValues.productName,
        category: basicValues.category,
        price: basicValues.price,
        description: basicValues.description,
        hasColor: hasVariants && hasColor,
        hasSize: hasVariants && hasSize,
        quantity: hasVariants ? undefined : parseInt(noVariantQtyStr, 10) || 0,
        newImageFiles: newFiles,
        deleteImageIds: deleteIds,
        spotlightImageId: !spotlightIsNew ? spotlightImg?.existingId : undefined,
        spotlightIndex: spotlightIsNew ? spotlightNewIndex : undefined,
        variants,
      };
      onSubmit(data);
    }
  };

  const handleNextOrSubmit = handleBasicSubmit(() => {
    if (images.length === 0) { toast.error('Please upload at least one image.'); return; }
    if (!hasVariants) {
      if (!noVariantQtyStr || parseInt(noVariantQtyStr, 10) === 0) {
        toast.error('Please enter a stock quantity greater than 0.'); return;
      }
      buildAndSubmit();
      return;
    }
    if (hasColor && colours.length === 0) { toast.error('Please add at least one colour.'); return; }
    if (hasSize && sizes.length === 0) { toast.error('Please add at least one size.'); return; }
    setShowMatrix(true);
    setTimeout(() => {
      document.getElementById('stock-matrix-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  const categoryOptions = STORE_CATEGORIES.map((c) => ({ label: c, value: c }));

  return (
    <div className="space-y-8">

      {/* ── Basic Info ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-800">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            id="productName"
            label="Item Name"
            placeholder="Enter the item name"
            style={{ backgroundColor: '#F8F7F4' }}
            error={basicErrors.productName?.message}
            required
            {...register('productName')}
          />
          <SelectInput
            id="category"
            label="Category"
            options={categoryOptions}
            placeholder="Select the category" error={basicErrors.category?.message}
            labelClassName={eventFormFieldLabelClassName}
            className={eventFormSelectClassName}
            controlClassName={eventFormSelectControlClassName}
            value={watchBasic('category')}
            required
            onChange={(e) => setBasicValue('category', e.target.value, { shouldValidate: true })}

          />
          <FormInput
            id="price"
            label="Price (₦)"
            placeholder="Enter the item price"
            style={{ backgroundColor: '#F8F7F4' }}
            error={basicErrors.price?.message}
            required
            value={formatWithCommas(watchBasic('price'))}
            onChange={(e) => {
              setBasicValue('price', sanitizePriceInput(e.target.value), { shouldValidate: true });
            }}
          />
        </div>
        <TextareaInput
          id="description"
          label="Description"
          style={{ backgroundColor: '#F8F7F4' }}
          placeholder="Enter a short description of the item." rows={4}
          required
          error={basicErrors.description?.message} {...register('description')}
        />
      </section>

      {/* ── Item Images ─────────────────────────────────────────────────── */}
      <section className="space-y-4 max-w-2xl">
        <h3 className="text-sm font-bold text-gray-800">Item Images <sup className='text-red-500 text-base'>*</sup></h3>
        <ImageUpload
          label="Item Gallery"
          previews={imagePreviews}
          idleIcon={<CloudUpload className='text-red-500' />}
          dropzoneClassName={eventFormUploadDropzoneClassName}
          onChange={handleGalleryChange}
          hint="Supported formats: PNG, JPG, JPEG or WEBP up to 2mb each" multiple
        />
        {images.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-3">
              <p className="text-sm font-bold text-gray-800">Image role</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Select one spotlight image. It will be used as the main card image in the store.
              </p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img) => (
                <button
                  key={img.key} type="button" onClick={() => setSpotlight(img.key)}
                  className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${img.isSpotlight ? 'border-primary-500 shadow-md' : 'border-gray-200 hover:border-primary-300'
                    }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <span className={`absolute bottom-1.5 left-1 right-1 rounded-full px-1 py-0.5 text-center text-[9px] font-bold leading-none ${img.isSpotlight ? 'bg-primary-500 text-white' : 'bg-white/90 text-gray-600'
                    }`}>
                    {img.isSpotlight ? 'Spotlight' : 'Gallery'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(img.key); }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Inventory ───────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h3 className="text-sm font-bold text-gray-800">
          Inventory (Add colour and size variants if applicable)
        </h3>
        <p className="text-sm text-gray-500 max-w-2xl">
          Does this item have colour and/or size variants? If no, enter the stock quantity and
          submit. If yes, select yes and add the variants.
        </p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">No</span>
          <button
            type="button" role="switch" aria-checked={hasVariants}
            onClick={() => {
              setHasVariants((v) => !v);
              setHasColor(false);
              setHasSize(false);
              setShowMatrix(false);
            }}
            className={`relative inline-flex h-4 w-11 items-center rounded-full transition-colors ${hasVariants ? 'bg-primary-300' : 'bg-gray-300'
              }`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full shadow transition-transform ${hasVariants ? 'translate-x-6 bg-primary-400' : 'translate-x-0 bg-white'
              }`} />
          </button>
          <span className="text-sm text-gray-600">Yes</span>
        </div>

        {!hasVariants && (
          <div className="max-w-2xl">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              type="text"
              inputMode="numeric"
              value={noVariantQtyStr}
              style={{ backgroundColor: '#F8F7F4' }}
              onChange={(e) => setNoVariantQtyStr(digitsOnly(e.target.value))}
              placeholder="Enter the quantity"
              className="w-full h-11 px-4 border-2 border-gray-200 rounded-3xl text-sm focus:outline-none focus:border-primary-400"
            />
          </div>
        )}

        {hasVariants && (
          <div className="space-y-6">

            {/* Colour variants */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasColor}
                onChange={(e) => {
                  setHasColor(e.target.checked);
                  if (!e.target.checked) { setColours([]); setStockCells((p) => p.filter((c) => c.color === 'Default')); }
                  setShowMatrix(false);
                }}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
              />
              <span className="text-sm font-medium text-gray-700">This item has colour variants</span>
            </label>

            {hasColor && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: colour entry */}
                <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Colour</label>
                    <input
                      type="text"
                      value={colourInput}
                      style={{ backgroundColor: '#F8F7F4' }}
                      onChange={(e) => setColourInput(e.target.value)}
                      placeholder="Enter the colour name (e.g blue, white, black)"
                      className="w-full h-11 px-4 border-2 border-gray-200 rounded-3xl text-sm focus:outline-none focus:border-primary-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Select the Image of the Item in the Specified Colour (If it is not included
                    in the gallery below, add it to the gallery and then select)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img) => (
                      <button
                        key={img.key} type="button"
                        onClick={() => setSelectedColourImageKey(img.key)}
                        className={`w-[72px] h-[72px] rounded-xl overflow-hidden border transition-all shrink-0 ${selectedColourImageKey === img.key
                          ? 'border-primary-500 ring-1 ring-primary-200'
                          : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <label className="w-[72px] h-[72px] rounded-lg border-2 border-primary-500 flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                      <Plus size={20} className="text-primary-500" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleColourSectionUpload} />
                    </label>
                  </div>
                  <button
                    type="button" onClick={commitColour}
                    className="inline-flex items-center gap-1.5 border border-primary-500 text-primary-500 rounded-full px-3 py-0.5 text-sm font-semibold hover:bg-primary-50 transition-colors"
                  >
                    <Plus size={14} />
                    {editingColourIndex !== null ? 'Update colour' : 'Add colour'}
                  </button>
                </div>

                {/* RIGHT: colour table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden w-full sm:w-[400px]">
                  {/* Desktop view - hidden on mobile */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 border border-gray-200 w-[80px]">Colour</th>
                          <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 border border-gray-200 w-[100px]">Image</th>
                          <th className="w-20 border border-gray-200" />
                        </tr>
                      </thead>
                      <tbody>
                        {colours.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-6 text-center text-xs text-gray-400 border border-gray-200">
                              No colours added yet
                            </td>
                          </tr>
                        )}
                        {colours.map((entry, idx) => (
                          <tr key={entry.colorName}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 border border-gray-200 w-[80px]">{entry.colorName}</td>
                            <td className="px-4 py-3 border border-gray-200 w-[100px]">
                              {entry.imageUrl
                                ? <img src={entry.imageUrl} alt={entry.colorName} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                                : <span className="text-xs text-gray-400">No image</span>}
                            </td>
                            <td className="px-4 py-3 border border-gray-200">
                              <div className="flex items-center gap-1">
                                <button type="button" onClick={() => startEditColour(idx)} className="p-1.5 text-primary-400 hover:text-primary-600 transition-colors"><Pencil size={14} /></button>
                                <button type="button" onClick={() => deleteColour(idx)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view - card style with borders */}
                  <div className="sm:hidden divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
                    {colours.length === 0 && (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">
                        No colours added yet
                      </div>
                    )}
                    {colours.map((entry, idx) => (
                      <div key={entry.colorName} className="px-4 py-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-start gap-4">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            {entry.imageUrl
                              ? <img src={entry.imageUrl} alt={entry.colorName} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                              : <div className="w-16 h-16 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">No image</div>}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{entry.colorName}</p>
                            <p className="text-xs text-gray-500 mt-1">Colour</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditColour(idx)}
                              className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors rounded-full"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteColour(idx)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            )}

            {/* Size variants */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasSize}
                onChange={(e) => {
                  setHasSize(e.target.checked);
                  if (!e.target.checked) { setSizes([]); setStockCells((p) => p.filter((c) => c.size === 'One Size')); }
                  setShowMatrix(false);
                }}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
              />
              <span className="text-sm font-medium text-gray-700">This item has size variants</span>
            </label>

            {hasSize && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: size entry — consistent with colour */}
                <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Size</label>
                    <input
                      type="text"
                      value={sizeInput}
                      style={{ backgroundColor: '#F8F7F4' }}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitSize(); } }}
                      placeholder="Enter the size (e.g Large, Size 42, 29cm)"
                      className="w-full h-11 px-4 border-2 border-gray-200 rounded-3xl text-sm focus:outline-none focus:border-primary-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button" onClick={commitSize}
                      className="inline-flex items-center gap-1.5 border border-primary-500 text-primary-500 rounded-full px-3 py-0.5 text-sm font-semibold hover:bg-primary-50 transition-colors"
                    >
                      <Plus size={14} />
                      {editingSizeIndex !== null ? 'Update size' : 'Add size'}
                    </button>
                    {/* {editingSizeIndex !== null && (
                      <button
                        type="button" onClick={cancelEditSize}
                        className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-500 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )} */}
                  </div>
                </div>

                {/* RIGHT: size grid table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  {sizes.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs text-gray-400">No sizes added yet</p>
                  ) : (
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="flex flex-wrap">
                          {sizes.map((s, idx) => (
                            <td key={s.sizeName} className="flex items-center gap-1.5 border border-gray-100 px-3 py-2.5 min-w-[80px]">
                              <span className="text-xs font-semibold text-gray-700 mr-1">{s.sizeName}</span>
                              <button type="button" onClick={() => startEditSize(idx)} className="text-primary-400 hover:text-primary-600 shrink-0"><Pencil size={11} /></button>
                              <button type="button" onClick={() => deleteSize(idx)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={11} /></button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Stock Matrix (inline, revealed after Next) ───────────────────── */}
      {showMatrix && hasVariants && (
        <section id="stock-matrix-section" className="space-y-4">
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-1">Stock Quantities</h3>
            <p className="text-xs text-gray-500 mb-4">
              Leave a cell empty to record 0 stock for that combination.
            </p>
            <div className="border border-gray-200 rounded-2xl p-5">
              <StockMatrix
                colours={colours}
                sizes={sizes}
                hasColor={hasColor}
                hasSize={hasSize}
                cells={stockCells}
                onChange={setStockCells}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom buttons ───────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-4">
        {hasVariants ? (
          <>
            {!showMatrix ? (
              <Button
                type="button" onClick={handleNextOrSubmit} disabled={!nextEnabled}
                title={!nextEnabled ? 'Add at least one colour and/or size to continue' : undefined}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                type="button" loading={isSubmitting} disabled={isSubmitting}
                onClick={buildAndSubmit}
              >
                {mode === 'create' ? 'Add Item' : 'Save Changes'}
              </Button>
            )}
            {/* <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button> */}
          </>
        ) : (
          <>
            <Button
              type="button" onClick={handleNextOrSubmit}
              loading={isSubmitting} disabled={isSubmitting}
            >
              {mode === 'create' ? 'Add Item' : 'Save Changes'}
            </Button>
            {/* <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button> */}
          </>
        )}
      </div>
    </div>
  );
}