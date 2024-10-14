// app/components/EmailForm.tsx
"use client";
import { useState } from "react";

const EmailForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      alert("Email envoyé avec succès!");
    } else {
      alert("Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Entrez votre email"
        required
        className="rounded-md border-4 border-black bg-slate-800 text-white"
      />
      <button type="submit">Envoyer l'email</button>
    </form>
  );
};

export default EmailForm;
