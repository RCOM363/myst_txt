"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Loader2 } from "lucide-react";

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
    }
  };

  const fetchSuggestionMessages = async () => {
    setAreMessagesLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      const msgs = response.data.questions?.split("||");
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
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl text-center font-bold mb-4">Public Profile Link</h1>
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">
          Send Anonymous message to @{username}
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
                    <FormLabel>Message</FormLabel>
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
                className="w-full mt-4"
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
      </div>
      <Separator />

      <Button
        type="submit"
        className="mt-4"
        disabled={areMessagesLoading}
        onClick={() => fetchSuggestionMessages()}
      >
        {areMessagesLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Get message suggestions"
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-6">
        {messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Click on any messages below to select it
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
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
  );
}

export default Page;
