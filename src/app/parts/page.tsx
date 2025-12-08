import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type Part = {
  id: string;
  code: string | null;
  name: string | null;
  category: string | null;
  created_at: string;
};

export default async function PartsPage() {
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  const parts = (data ?? []) as Part[];

  if (error) {
    console.error(error);
    return (
      <main style={{ padding: 24 }}>
        <h1>Части</h1>
        <p style={{ color: "red" }}>Грешка при зареждане на части.</p>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Части в склада</h1>

      {parts.length === 0 && (
        <p>Нямаш добавени части още. Ще направим форма по-нататък.</p>
      )}

      {parts.length > 0 && (
        <table border={1} cellPadding={8} style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Код</th>
              <th>Име</th>
              <th>Категория</th>
              <th>Създаден</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id}>
                <td>{part.code}</td>
                <td>{part.name}</td>
                <td>{part.category}</td>
                <td>{new Date(part.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
