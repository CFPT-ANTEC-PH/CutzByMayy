import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface MailProps {
  code: number;
}

const VerifyEmail = ({ code }: MailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Sign in to simoncdt.ch</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={company}>CutzByMayy</Text>
          <Heading style={codeTitle}>Ton code d'authentification</Heading>
          <Text style={codeDescription}>
            Rentre le code suivant pour activer ton compte.
          </Text>
          <Section style={codeContainer}>
            <Heading style={codeStyle}>{code}</Heading>
          </Section>
          <Text style={paragraph}>
            Écrivez un mail à{" "}
            <Link href="mailto:contact@simoncdt.ch" style={link}>
              contact@simoncdt.ch
            </Link>{" "}
            s'il y a un problème avec le code.
          </Text>
          <Text style={footerText}>Veuillez ne pas répondre à ce mail.</Text>
        </Container>
      </Body>
    </Html>
  );
};

VerifyEmail.PreviewProps = {
  code: 123456,
} as MailProps;

export default VerifyEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  marginTop: "20px",
  width: "480px",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "12% 6%",
};

const company = {
  fontWeight: "bold",
  fontSize: "18px",
  textAlign: "center" as const,
};

const codeTitle = {
  textAlign: "center" as const,
};

const codeDescription = {
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
  maxWidth: "100%",
};

const codeStyle = {
  fontFamily: "monospace",
  color: "#000",
  display: "inline-block",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
  letterSpacing: "8px",
};

const buttonContainer = {
  margin: "27px auto",
  width: "auto",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  textAlign: "center" as const,
  padding: "12px 24px",
  margin: "0 auto",
};

const paragraph = {
  color: "#444",
  letterSpacing: "0",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};
