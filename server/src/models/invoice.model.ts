import mongoose, { Schema, Document, Types } from "mongoose";

export type PaymentMode = "cash" | "upi" | "card" | "insurance" | "other";
export type PaymentStatus = "paid" | "pending" | "partial";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice extends Document {
  _id: Types.ObjectId;
  clinicId: Types.ObjectId;
  patientId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  invoiceNumber: string;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  items: IInvoiceItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    subtotal: { type: Number, required: true, min: 0 },
    gstPercent: { type: Number, required: true, default: 0, min: 0 },
    gstAmount: { type: Number, required: true, default: 0, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card", "insurance", "other"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "pending",
      required: true,
    },
    items: { type: [invoiceItemSchema], default: [] },
    notes: { type: String },
  },
  { timestamps: true }
);

/**
 * Auto-generate invoiceNumber before validation (INV-YYYYMMDD-XXXXX format).
 */
invoiceSchema.pre("validate", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await mongoose.model("Invoice").countDocuments({ clinicId: this.clinicId });
    this.invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);
