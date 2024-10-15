import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";

type Reservation = {
  id: string;
  client_id: string;
  start_time: Date;
  end_time: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  availability_id: string;
};

interface ReservationMailProps {
  userFirstname: string;
  date: Date;
}

export const ReservationMail = ({
  userFirstname,
  date,
}: ReservationMailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>CutzByMayy</Heading>
        <Text style={paragraph}>Salut {userFirstname},</Text>
        <Text style={paragraph}>Ta réservation à bien été enregistrée.</Text>
        <Text style={paragraph}>
          Voici les informations de ta réservation :
        </Text>
        <Text style={paragraph}>
          {format(date, "PPPP", { locale: fr })}
          {" à "}
          {format(date, "p", { locale: fr })}
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href="https://cutzbymayy.vercel.app/account/reservation"
          >
            Aller voir ma réservation
          </Button>
        </Section>
        <Text style={paragraph}>
          On se voit bientôt alors,
          <br />
          CutzByMayy
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Le barber préféré de ton barber préféré !</Text>
      </Container>
    </Body>
  </Html>
);

ReservationMail.PreviewProps = {
  userFirstname: "Alan",
  date: new Date(),
} as ReservationMailProps;

export default ReservationMail;

const h1 = { fontSize: "40px", fontWeight: "bold" };

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Geist', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
