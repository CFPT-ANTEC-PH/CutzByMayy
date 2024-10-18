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
      <Preview>Confirmation de la réservation</Preview>
      <Container style={container}>
        <Text style={company}>CutzByMayy</Text>
        <Heading style={reservationTitle}>
          Ta réservation a bien été enregistrée.
        </Heading>
        <Text style={reservationDescription}>
          Voici les informations de ta réservation :
        </Text>
        <Text style={reservationDescriptionInfo}>
          {format(date, "PPPP", { locale: fr })}
          {" à "}
          {format(date, "p", { locale: fr })}
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="https://simoncdt.ch/account/reservation">
            Aller voir ma réservation
          </Button>
        </Section>
        <Text style={reservationDescription}>
          On se voit bientôt alors,
          <br />
          CutzByMayy
        </Text>
        <Hr style={hr} />
        <Text style={footerText}>
          Le barber préféré de ton barber préféré !
        </Text>
        <Text style={footerText}>Veuillez ne pas répondre à ce mail.</Text>
      </Container>
    </Body>
  </Html>
);

ReservationMail.PreviewProps = {
  userFirstname: "Alan",
  date: new Date(),
} as ReservationMailProps;

export default ReservationMail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  marginTop: "20px",
  width: "570px",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "12% 6%",
};

const btnContainer = {
  textAlign: "center" as const,
  width: "auto",
};

const button = {
  backgroundColor: "#3B86F6",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "15px 20px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
const footerText = {
  fontSize: "12px",
};
const company = {
  fontWeight: "bold",
  fontSize: "18px",
  textAlign: "center" as const,
};
const reservationTitle = {
  textAlign: "center" as const,
};
const reservationDescription = {
  textAlign: "center" as const,
};

const reservationDescriptionInfo = {
  textAlign: "center" as const,
  fontSize: "14px",
  fontWeight: "bold",
};
