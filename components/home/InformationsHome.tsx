import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InformationsHome() {
  return (
    <section className="bg-gray-200 py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">
          Où nous trouver
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle>Notre emplacement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d569.820461227504!2d14.507682865743774!3d35.908581552055765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130e4525284781c1%3A0xa4b08932997e549f!2s60%20Triq%20Tigne&#39;%2C%20Tas-Sliema%2C%20Malte!5e1!3m2!1sfr!2sch!4v1727171391220!5m2!1sfr!2sch"
                  width="100%"
                  height="100%"
                  loading="lazy"
                ></iframe>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <span>60 Triq Tigne&apos;, Tas-Sliema, Malte</span>
                </li>
                <li className="flex items-start">
                  <Phone className="mr-2 h-5 w-5 text-primary" />
                  <span>+49 1 23 45 67 89</span>
                </li>
                <li className="flex items-start">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <ul>
                      <li>Lundi - Vendredi: 9h00 - 19h00</li>
                      <li>Samedi: 10h00 - 18h00</li>
                      <li>Dimanche: Fermé</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
