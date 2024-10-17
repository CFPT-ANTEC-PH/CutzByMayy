import VerifyEmail from "@/emails/verifyEmail";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, res: Response) {
  const { email, code } = await request.json();

  const { data, error } = await resend.emails.send({
    from: "CutzByMayy <noreply@simoncdt.ch>",
    to: [email],
    subject: "Votre code de vérification",
    html: render(VerifyEmail({ code })),
  });

  if (error) {
    return Response.json(error);
  }

  return Response.json({ message: "Email sent!" });
}
