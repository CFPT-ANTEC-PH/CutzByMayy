import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselHome() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  // Array of image URLs
  const images = [
    "/coupe/1.jpeg",
    "/coupe/2.jpeg",
    "/coupe/3.jpeg",
    "/coupe/4.jpeg",
    "/coupe/5.jpeg",
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-md max-lg:w-2/3"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-10 max-lg:p-6">
                  <Image
                    src={image}
                    alt={`Coupe ${index + 1}`}
                    height={1000}
                    width={1000}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
