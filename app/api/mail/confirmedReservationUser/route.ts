import ReservationMail from "@/emails/ConfirmedReservationUser";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, res: Response) {
  const { email, userFirstname, date } = await request.json();

  const { data, error } = await resend.emails.send({
    from: "CutzByMayy <noreply@simoncdt.ch>",
    to: [email],
    subject: "La réservation est carré !",
    html: render(ReservationMail({ userFirstname, date })),
  });

  if (error) {
    return Response.json(error);
  }

  return Response.json({ message: "Email sent!" });
}
