type CardProps = {
  title: string;
  description: string;
  color: string;
};

export default function Card({ title, description, color }: CardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200">
      <div className="h-40" style={{ backgroundColor: color }} />
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
