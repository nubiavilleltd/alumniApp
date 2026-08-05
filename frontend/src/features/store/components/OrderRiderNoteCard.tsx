// /feature/store/components/orders/OrderRiderNoteCard.tsx

import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

interface OrderRiderNoteCardProps {
    showRiderDetails: boolean;
    riderDetails: string;
    onRiderDetailsChange: (value: string) => void;
    note: string;
    onNoteChange: (value: string) => void;
    riderDetailsError?: string;
}

export default function OrderRiderNoteCard({
    showRiderDetails,
    riderDetails,
    onRiderDetailsChange,
    note,
    onNoteChange,
    riderDetailsError,
}: OrderRiderNoteCardProps) {
    return (
        <div className="w-full h-full bg-white rounded-2xl p-6 flex flex-col gap-5">
            {showRiderDetails && (
                <TextareaInput
                    id="rider_details"
                    label="Rider Details"
                    required
                    value={riderDetails}
                    onChange={(e) => onRiderDetailsChange(e.target.value)}
                    placeholder="Rider's name, phone number, vehicle details, etc."
                    rows={3}
                    error={riderDetailsError}
                    className="gap-2"
                />
            )}

            <TextareaInput
                id="order_note"
                label="Notes"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Any additional notes for this order..."
                rows={3}
                className="gap-2"
            />
        </div>
    );
}