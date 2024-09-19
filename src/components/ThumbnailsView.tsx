export interface ThumbnailsProps {
  source: string;
  title: string;
  desc: string;
  size?: number;
  className?: string;
}

export const ThumbnailsView = ({
  source,
  title,
  desc,
  size,
  className,
  ...props
}: ThumbnailsProps) => {
  return (
    <div className="overflow-hidden shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
      <img
        src={source}
        alt={title}
        className="rounded-lg w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{title}</h3>
        <p className="text-sm text-white mt-2">{desc}</p>
      </div>
    </div>
  );
};
