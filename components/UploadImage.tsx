"use client";

import { UploadButton } from "@/utils/uploadthing";

type Props = {
  endpoint: "postImage";
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({
  endpoint,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Post"
            className="rounded-lg w-full max-h-96 object-cover"
          />

          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      )}

      {!value && (
        <UploadButton
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            onChange(res[0].ufsUrl);
          }}
          onUploadError={(error) => {
            alert(error.message);
          }}
        />
      )}
    </div>
  );
}