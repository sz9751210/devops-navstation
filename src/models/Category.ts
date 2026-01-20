import mongoose, { Schema, Model } from 'mongoose';

// 1. 定義 Link Item Schema
const LinkItemSchema = new Schema({
  id: { type: String, required: true }, // 前端生成的 UUID
  title: { type: String, required: true },
  description: String,
  icon: String,
  urlTemplate: { type: String, required: true },
  visibleIn: [String], // ['dev', 'prod']
  tags: [String]
});

// 2. 定義 Group Schema
const LinkGroupSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  items: [LinkItemSchema] // 巢狀連結
});

// 3. 定義 Top Level Category Schema
const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  groups: [LinkGroupSchema],
  order: { type: Number, default: 0 } // 方便未來做排序
}, { timestamps: true });

// Next.js Hot Reload fix: 檢查是否已經編譯過 Model
const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default CategoryModel;