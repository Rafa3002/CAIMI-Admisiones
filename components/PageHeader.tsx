export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?:
    React.ReactNode;
}) {

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          {title}
        </h1>

        {description && (

          <p className="text-slate-500 mt-1">
            {description}
          </p>

        )}

      </div>

      {action}

    </div>
  );
}