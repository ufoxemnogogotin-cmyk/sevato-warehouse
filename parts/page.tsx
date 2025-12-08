import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function PartsPage() {
  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Части</h1>
        <p className="text-red-400">Грешка при зареждане на части.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Части в склада</h1>

      {(!parts || parts.length === 0) && (
        <p className="text-sm text-gray-400">
          Нямаш добавени части още. Ще направим форма по-нататък.
        </p>
      )}

      {parts && parts.length > 0 && (
        <table className="min-w-full text-sm border border-gray-700">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/40">
              <th className="p-2 text-left">Код</th>
              <th className="p-2 text-left">Име</th>
              <th className="p-2 text-left">Категория</th>
              <th className="p-2 text-left">Създаден</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part: any) => (
              <tr key={part.id} className="border-b border-gray-800">
                <td className="p-2 font-mono text-xs">{part.code}</td>
                <td className="p-2">{part.name}</td>
                <td className="p-2">{part.category}</td>
                <td className="p-2 text-xs text-gray-400">
                  {new Date(part.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
