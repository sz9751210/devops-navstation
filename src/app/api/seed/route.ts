import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CategoryModel from '@/models/Category';
import initialData from '@/config/data.json';

export async function GET() {
  try {
    await connectDB();
    
    // 清空舊資料
    await CategoryModel.deleteMany({});
    
    // 插入新資料
    await CategoryModel.create(initialData.categories);
    
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}