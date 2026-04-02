import mongoose, { Schema } from 'mongoose'

// ── Element Mask ──────────────────────────────────────────────────
const ElementMaskSchema = new Schema({
  type: { type: String, default: '' },
  left: { type: Number, default: 0 },
  top: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  scaleX: { type: Number, default: 1 },
  scaleY: { type: Number, default: 1 },
  background: { type: String, default: '' },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
}, { _id: false })

// ── Canvas Element ─────────────────────────────────────────────────
const CanvasElementSchema = new Schema({
  uid: { type: String, required: true },
  type: { type: String, required: true },
  src: { type: String, default: '' },
  left: { type: Number, default: 0 },
  top: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  originalWidth: { type: Number, default: 0 },
  originalHeight: { type: Number, default: 0 },
  scaleX: { type: Number, default: 1 },
  scaleY: { type: Number, default: 1 },
  rotation: { type: Number, default: 0 },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  text: { type: String },
  fontSize: { type: Number },
  fontFamily: { type: String },
  color: { type: String },
  imageList: { type: [Schema.Types.Mixed], default: [] },
  config: { type: Schema.Types.Mixed },
  horizontal: { type: Number },
  vertical: { type: Number },
  mask: { type: ElementMaskSchema },
  start: { type: Number },
  end: { type: Number },
}, { _id: false })

// ── Page State ─────────────────────────────────────────────────────
const PageStateSchema = new Schema({
  uid: { type: String, required: true },
  bgColor: { type: String, default: '#000000' },
  elements: { type: [CanvasElementSchema], default: [] },
}, { _id: false })

// ── Canvas Document ────────────────────────────────────────────────
const CanvasSchema = new Schema(
  {
    name: { type: String, required: true },
    mode: { type: String, enum: ['live', 'editor'], default: 'live' },
    aspectRatio: { type: String, default: '9:16' },
    bgColor: { type: String, default: '#000000' },
    pages: { type: [PageStateSchema], default: [] },
    track: { type: [Schema.Types.Mixed], default: [] },
    projectId: { type: String },
    isPublic: { type: Boolean, default: false },
    thumbnail: { type: String },
    themeColor: { type: String, default: '' },
  },
  { timestamps: true, collection: 'canvases' }
)

export const CanvasModel = (mongoose.models.Canvas ?? mongoose.model('Canvas', CanvasSchema)) as mongoose.Model<any>
