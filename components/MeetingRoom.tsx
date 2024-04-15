"use client";
import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

type CallLayoutType = "gird" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(true);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "gird":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <div className="relative w-full h-screen pt-4 overflow-hidden text-white">
      <div className="relative flex items-center justify-center size-full">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList
            onClose={() => {
              setShowParticipants(false);
            }}
          />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-wrap items-center justify-center w-full gap-5 mb-4 xl:mb-0">
        <CallControls onLeave={() => router.push("/")} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535d]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="text-white border-dark-1 bg-dark-1">
            {["Gird", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className={cn(
                    "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#4c535d]",
                    {
                      "bg-blue-500 text-white": layout === item.toLowerCase(),
                    }
                  )}
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType);
                  }}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="cursor-pointer rounded-2xl  bg-[#19232d] px-4 py-2 hover:bg-[#4c535d]"
        >
          <User size={20} className="text-white" />
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </div>
  );
};

export default MeetingRoom;
