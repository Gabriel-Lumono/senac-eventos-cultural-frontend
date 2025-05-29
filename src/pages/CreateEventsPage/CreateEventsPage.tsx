import { useState, type FormEvent } from "react";
import styles from "./CreateEventsPage.module.css"; // crie o CSS como preferir
import NavBarComponent from "../../components/NavBar/NavBarComponent";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!bannerFile) {
      setError("Você precisa escolher um arquivo de banner.");
      return;
    }

    // Monta o FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("price", String(price));
    formData.append("banner", bannerFile);

    // Busca token no localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const res = await fetch(
        "https://senac-eventos-cultural-backend-production.up.railway.app/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // **não** coloque Content-Type aqui — o navegador define o multipart boundary
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Erro ${res.status}`);
      }

      setSuccess(true);
      // opcional: limpar o form
      setTitle("");
      setDescription("");
      setLocation("");
      setPrice(0);
      setBannerFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  return (
    <>
      <NavBarComponent />
      <div className={styles.container}>
        <h1>Criar Evento</h1>
        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>Evento criado com sucesso!</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Título
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label>
            Localização
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>

          <label>
            Preço (R$)
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </label>

          <label>
            Banner
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setBannerFile(e.target.files[0]);
              }}
              required
            />
          </label>

          <button type="submit">Criar Evento</button>
        </form>
      </div>
    </>
  );
}
