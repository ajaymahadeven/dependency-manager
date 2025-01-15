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
      <Card>
        <CardHeader>
          <CardTitle>Upload package.json</CardTitle>
          <CardDescription>
            Drag and drop your package.json file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop your package.json here or
                <label className="mx-1 cursor-pointer text-primary hover:underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="application/json"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                Only package.json files are supported
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
