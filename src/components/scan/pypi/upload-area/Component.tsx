import { Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UploadAreaComponent({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
}: {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle>Upload Python Dependencies</CardTitle>
          <CardDescription>Drop your requirements.txt here</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="text-muted-foreground mb-4 h-8 w-8" />
            <label className="hover:text-primary cursor-pointer text-center text-sm transition-colors">
              <span className="text-primary">Choose a file</span>
              <span className="text-muted-foreground"> or drag it here</span>
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
