import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image",
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: { message: string }) => {
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (response: IKUploadResponse) => {
        setUploading(false);
        onSuccess(response);
        setError(null);
    };

    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentageComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentageComplete));
        }
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file");
                return false;
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("Video size must be less than 100MB");
                return false;
            }
        } else {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                setError(
                    "Please upload a valid image file (JPEG, PNG, or WebP)"
                );
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                return false;
            }
        }
        return true;
    };

    return (
        <div className="space-y-2">
            <IKUpload
                fileName={fileType === "image" ? "image" : "video"}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadStart={handleStartUpload}
                onUploadProgress={handleProgress}
                accept={fileType === "image" ? "image/*" : "video/*"}
                className="file-input file-input-bordered w-full"
                validateFile={validateFile}
                useUniqueFileName={true}
                folder={fileType === "image" ? "/images" : "/videos"}
            />
            {uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}{" "}
        </div>
    );
}
