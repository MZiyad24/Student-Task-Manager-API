import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  
  async uploadFile(file: any, folder: string): Promise<string> {
    // 1. Define the base path (e.g., ./uploads/profile_pics)
    const uploadPath = path.join(process.cwd(), 'uploads', folder);
  
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
    const fullPath = path.join(uploadPath, fileName);

    fs.writeFileSync(fullPath, file.buffer);

    console.log(`File saved locally to: ${fullPath}`);

    return `http://localhost:3000/uploads/${folder}/${fileName}`;
  }
}