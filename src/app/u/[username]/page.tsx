"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2, Sparkles } from "lucide-react";
import { ReportView } from "./view";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Array<string>>([]);
  const [areMessagesLoading, setAreMessagesLoading] = useState(false);

  const params = useParams<{ username: string }>();
  const { username } = params;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });
      toast.success("Message added successfully", {
        description: response.data.message,
      });
      form.setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error while adding message", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSubmitting(false);
      setMessages([]);
    }
  };

  const fetchSuggestionMessages = async () => {
    setAreMessagesLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      const resStr = response.data.questions?.slice(0, -1);
      const msgs = resStr?.split("||");
      setMessages(msgs as Array<string>);
      toast.success("Fetched suggestion messages successfully", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error while getting suggestion messages", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setAreMessagesLoading(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] pt-20">
      <ReportView slug={username} />
      <div className="w-[90%] mx-auto p-6 rounded-lg max-w-2xl border-solid border-[2px]">
        <h1 className="text-2xl sm:text-4xl text-[#8a2be2] text-center font-bold mb-4">
          Send an Anonymous Message
        </h1>
        <div className="mb-4">
          <h2 className="text-sm text-center font-semibold mb-2">
            Your message will be delivered to @{username} anonymously.
          </h2>{" "}
          <div className="flex items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="input input-bordered w-full p-2 mr-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your message here"
                          {...field}
                          name="content"
                          className="h-[10vh]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-4 bg-[#8a2be2] hover:bg-[#7424c9] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <p className="w-full text-center text-sm">
            Want your own MystTxt link?{" "}
            <Link href={"/sign-up"} className="text-[#8a2be2] font-semibold">
              Sign Up Now!
            </Link>
          </p>
        </div>
        <Separator />

        <div className="w-full flex justify-center items-center">
          <Button
            type="submit"
            className="mt-4 text-[#8a2be2] bg-transparent hover:bg-[#7424c9] hover:text-white border-[#8a2be2] border-[2px]"
            disabled={areMessagesLoading}
            onClick={() => fetchSuggestionMessages()}
          >
            {areMessagesLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get message suggestions
              </>
            )}
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-6">
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Click on any messages below to select it
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col items-center gap-1 space-y-4">
                {messages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto text-wrap text-ellipsis text-center p-3 mb-2"
                    onClick={() => form.setValue("content", message)}
                  >
                    {message}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
