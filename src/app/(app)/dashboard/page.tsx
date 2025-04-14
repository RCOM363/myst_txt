"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "next-auth";
import Pagination from "@/components/Pagination";
import { checkProfanitySchema } from "@/schemas/checkProfanitySchema";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageViews, setPageViews] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  const { data: session } = useSession();

  const acceptMessagesForm = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const checkProfanityForm = useForm({
    resolver: zodResolver(checkProfanitySchema),
  });

  const {
    register: registerAccept,
    watch: watchAccept,
    setValue: setValueAccept,
  } = acceptMessagesForm;
  
  const acceptMessages = watchAccept("acceptMessages");

  const {
    register: registerProfanity,
    watch: watchProfanoty,
    setValue: setValueProfanity,
  } = checkProfanityForm;

  const checkProfanity = watchProfanoty("checkProfanity");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValueAccept(
        "acceptMessages",
        response.data.isAcceptingMessage as boolean
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error fetching message acceptance status", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValueAccept]);

  const fetchCheckProfanity = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/check-profanity");
      setValueProfanity(
        "checkProfanity",
        response.data.checkProfanity as boolean
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error fetching check profanity status", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValueProfanity]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>(
          `/api/get-messages?page=${currentPage}&limit=6`
        );
        setMessages(response.data.messages || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalMessages(response.data.totalMessages || 0);
        if (refresh) {
          toast.success("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Error fetching messages", {
          description: axiosError.response?.data.message,
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, currentPage]
  );

  // optimistic ui update for messages
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchPageView = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/pageview");
      setPageViews(response.data.totalViews || 0);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error fetching messages", {
        description: axiosError.response?.data.message,
      });
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
    fetchCheckProfanity();
    fetchPageView();
  }, [
    session,
    setValueAccept,
    fetchAcceptMessage,
    setValueProfanity,
    fetchCheckProfanity,
    fetchMessages,
  ]);

  // handle swtich change
  const handleAcceptMessagesChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValueAccept("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error updating message acceptance status", {
        description: axiosError.response?.data.message,
      });
    }
  };

  const handleCheckProfanityChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/check-profanity", {
        checkProfanity: !checkProfanity,
      });
      setValueProfanity("checkProfanity", !checkProfanity);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error updating check profanity status", {
        description: axiosError.response?.data.message,
      });
    }
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  const { username } = session?.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="my-8 mx-auto md:mx-8 lg:mx-auto p-6 rounded w-[100%] lg:max-w-6xl">
      <h1 className="text-4xl text-[#8a2be2] font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        {/* public url */}
        <h2 className="text-lg font-semibold mb-2">
          Copy Your Unique Link
        </h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered light:bg-[#f8f0ff] dark:bg-slate-800 dark:text-white rounded-lg w-full p-2 mr-2"
          />
          <Button
            className="bg-[#8a2be2] hover:bg-[#7424c9] text-white"
            onClick={copyToClipboard}
          >
            <Copy />
            Copy
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center md:gap-4 lg:gap-4">
        {/* accept messages switch */}
        <div className="flex justify-start items-center mb-4">
          <Switch
            {...registerAccept("acceptMessages")}
            className="data-[state=checked]:bg-[#8a2be2]"
            checked={acceptMessages}
            onCheckedChange={handleAcceptMessagesChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        {/* check profanity swtich */}
        <div className="flex justify-start items-center mb-4">
          <Switch
            {...registerProfanity("checkProfanity")}
            className="data-[state=checked]:bg-[#8a2be2]"
            checked={checkProfanity}
            onCheckedChange={handleCheckProfanityChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Langauge Profanity Filter: {checkProfanity ? "On" : "Off"}
          </span>
        </div>
      </div>
      <Separator />

      <div className="flex items-center gap-2 mt-4">
        <Button
          className=" text-[#8a2be2] bg-transparent hover:text-white hover:bg-[#7424c9] border-[#8a2be2] border-[2px]"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        {/* stats */}
        <Button className="bg-[#8a2be2] hover:bg-[#7424c9] text-white">
          <span>Views : {pageViews}</span>
        </Button>
        <Button className="bg-[#8a2be2] hover:bg-[#7424c9] text-white">
          <span>Messages : {totalMessages}</span>
        </Button>
      </div>
      {/* messages */}
      <ScrollArea className="w-full h-[40vh] p-4">
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </ScrollArea>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Page;
