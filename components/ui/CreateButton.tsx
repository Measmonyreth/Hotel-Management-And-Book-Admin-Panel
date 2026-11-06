import Image from "next/image";

interface CreateButtonProp {
  label: string;
  onClick: () => void;
}

export default function CreateButton({ label, onClick }: CreateButtonProp) {
  return (
    <button
      type="button"
      className="rounded-lg bg-blue-500 text-white px-4 py-2 text-sm font-medium  transition hover:bg-gray-700 flex gap-2 items-center"
      onClick={onClick}
    >
      <Image
        src="/icons/add.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
      {label}
    </button>
  );
}
