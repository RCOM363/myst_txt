"use client";

import { ArrowRight, Mail } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="h-[89vh] flex justify-center p-1 lg:p-8 ">
        <div className="container grid grid-cols-1 lg:grid-cols-2 items-center gap-6 md:gap-0 p-5 md:p-2">
          <div className="flex max-w-[980px] flex-col items-center lg:items-start gap-2">
            <h1 className="text-4xl text-center font-bold leading-tight tracking-tighter text-[#8a2be2] md:text-5xl lg:text-left lg:text-6xl lg:leading-[1.1]">
              Anonymous messages, <br />
              real connections.
            </h1>
            <p className="max-w-[750px] text-lg text-center text-gray-600 lg:text-left sm:text-xl">
              Create your personal link, share it with friends, and receive
              anonymous messages. Express yourself freely without revealing your
              identity.
            </p>
            <div className="flex flex-col gap-4 mt-2 sm:flex-row">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="gap-2 bg-[#8a2be2] hover:bg-[#7424c9] text-white"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          {/* carousel for messages */}
          <div className="w-full flex flex-col justify-start  items-center lg:items-end">
            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              className="w-full max-w-lg md:max-w-xl"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Mail className="flex-shrink-0" />
                        <div>
                          <p>{message.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>
    </main>
  );
}
