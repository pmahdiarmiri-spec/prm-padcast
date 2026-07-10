import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ 
        success: false, 
        error: "پوشه uploads در مسیر public وجود ندارد. لطفاً آن را بسازید." 
      }, { status: 404 });
    }

    const files = fs.readdirSync(uploadsDir);
    return NextResponse.json({
      success: true,
      uploadsDirectoryPath: uploadsDir,
      filesCount: files.length,
      availableFiles: files
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
