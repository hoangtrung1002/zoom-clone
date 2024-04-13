"use client";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";

interface Response {
  call: Call | undefined;
  isCallLoading: boolean;
}

const useGetCallById = (id: string | string[]): Response => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState<boolean>(false);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      const { calls } = await client.queryCalls({ filter_conditions: { id } });

      if (calls.length > 0) setCall(calls[0]);

      setIsCallLoading(false);
    };

    loadCall();
  }, [client, id]);

  return {
    call,
    isCallLoading,
  };
};

export default useGetCallById;
