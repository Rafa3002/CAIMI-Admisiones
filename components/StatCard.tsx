export default function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value:
    string | number;
  description?: string;
}) {

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="text-4xl font-bold text-sky-800 mt-3">
        {value}
      </p>

      {description && (

        <p className="text-sm text-slate-400 mt-2">
          {description}
        </p>

      )}

    </div>
  );
}