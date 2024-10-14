// app/api/send/route.ts

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Votre Nom <votre-email@example.com>",
      to: [body.email], // Recevez l'email du corps de la requête
      subject: "Bonjour le monde",
      html: "<strong>Votre email a été envoyé avec succès!</strong>",
    }),
  });
  console.log(response);

  if (response.ok) {
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response("Erreur lors de l'envoi de l'email", { status: 500 });
  }
}
