import { model, Schema, models, Types } from "mongoose";
import { IBookSegment } from '@/type';

const BookSegmentSchema = new Schema<IBookSegment>({
    clerkId: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true },
    pageNumber: { type: Number },
    wordCount: { type: Number, required: true },
}, { timestamps: true });

const BookSegment = models.BookSegment || model<IBookSegment>('BookSegment', BookSegmentSchema);

export default BookSegment;
