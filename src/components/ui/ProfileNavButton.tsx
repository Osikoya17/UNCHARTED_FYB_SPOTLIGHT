interface ProfileNavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  /** Name of the student this button jumps to, used for the tooltip. */
  targetLabel?: string;
}

const BUTTONS = {
  prev: { icon: "/CSC UN - Left button.svg", label: "Previous student" },
  next: { icon: "/CSC UN - Right button.svg", label: "Next student" },
} as const;

/**
 * Steps to the previous/next student. The artwork is a small arrow centred in a
 * 100×100 canvas, so it is scaled up inside a clipped box to read at toolbar
 * size instead of rendering as a speck.
 */
const ProfileNavButton = ({ direction, onClick, targetLabel }: ProfileNavButtonProps) => {
  const { icon, label } = BUTTONS[direction];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={targetLabel ? `${label}: ${targetLabel}` : label}
      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-(--surface) transition hover:border-white/40 hover:bg-white/10 active:translate-y-px"
    >
      <img src={icon} alt="" aria-hidden="true" className="h-full w-full scale-150" />
    </button>
  );
};

export default ProfileNavButton;
