"use client";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";

const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState<boolean>(false);

  const client = useStreamVideoClient();

  useEffect(() => {}, [client, id]);

  return {};
};

export default useGetCallById;
