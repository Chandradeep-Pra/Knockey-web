interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}


export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        py-4
        rounded-2xl
        font-medium
        text-lg
        transition
        shadow-lg

        ${
          disabled
            ? "bg-muted text-muted cursor-not-allowed"
            : "bg-primary text-white hover:brightness-105 active:scale-95"
        }
      `}
    >
      {children}
    </button>
  );
}

