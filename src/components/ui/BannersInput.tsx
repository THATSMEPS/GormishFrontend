import React, { useRef } from 'react';

interface BannersInputProps {
  banners: string[];
  onChange: (banners: string[]) => void;
}

const BannersInput: React.FC<BannersInputProps> = ({ banners, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newBanners = [...banners];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        newBanners.push(url);
      }
      onChange(newBanners);
    }
  };

  const handleRemove = (index: number) => {
    const newBanners = banners.filter((_, i) => i !== index);
    onChange(newBanners);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <label className="form-label">Banners</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {banners.map((banner, index) => (
          <div key={index} className="relative w-24 h-16 border rounded overflow-hidden">
            <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={triggerFileInput}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Upload Banners
      </button>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default BannersInput;
