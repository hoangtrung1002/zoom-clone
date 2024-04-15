// @ts-nocheck

"use client";
import useGetCalls from "@/hooks/useGetCalls";
import { formatString } from "@/utils";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";

interface CallListProps {
  type: "upcoming" | "ended" | "recordings";
}

const CallList = ({ type }: CallListProps) => {
  const { endedCalls, upComingCalls, callRecordings, isLoading } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upComingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Try again" });
      }
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            title={
              formatString((meeting as Call).state?.custom.description) ||
              formatString((meeting as CallRecording).filename) ||
              "Personal Meeting" ||
              "No description"
            }
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            date={
              meeting.state?.startsAt.toLocaleString() ||
              meeting.start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            link={
              type === "recordings"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
            handleClick={
              type === "recordings"
                ? () => router.push(`${meeting.url}`)
                : () => router.push(`/meeting/${meeting.id}`)
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
