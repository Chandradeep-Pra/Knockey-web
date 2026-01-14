interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function PrimaryButton({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-primary
        text-white
        py-4
        rounded-2xl
        font-medium
        text-lg
        transition
        active:scale-95
        hover:brightness-105
        shadow-lg
      "
    >
      {children}
    </button>
  );
}
