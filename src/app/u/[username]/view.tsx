"use client";

import React, { useEffect } from "react";
import axios from "axios";

const incrementCount = async (username: string) => {
  await axios.post("/api/pageview", JSON.stringify({ username }));
};

export const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
  useEffect(() => {
    incrementCount(slug);
  }, [slug]);

  return null;
};
