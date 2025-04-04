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
          <CardTitle>Upload Composer.json</CardTitle>
          <CardDescription>
            Drag and drop your Composer.json file or click to browse
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
              <Upload className="text-muted-foreground h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                Drop your composer.json here or
                <label className="text-primary mx-1 cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="application/json"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-muted-foreground text-xs">
                Only composer.json files are supported
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
