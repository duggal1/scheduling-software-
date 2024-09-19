import prisma from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import { notFound } from "next/navigation";
import React from "react";
import { startOfDay, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { BookMarked, CalendarX2, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RenderCalendar } from "@/app/components/demo/RenderCalendar";
import { TimeSlots } from "@/app/components/TimeSlots";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/components/SubmitButton";

const targetDate = new Date(2024, 8, 19); // Note: month is 0-indexed, so 8 is September
const nextDay = addDays(targetDate, 1);

async function getData(userName: string) {
  const data = await prisma.user.findUnique({
    where: {
      username: userName,
    },
    select: {
      grantEmail: true,
      grantId: true,
      image: true,
      Availability: true,
    },
  });
  /* const data = await prisma.availability.findMany({
    where: {
      User: {
        username: userName,
      },
    },

    select: {
      User: {
        select: {
          grantId: true,
          grantEmail: true,
        },
      },
      day: true,
      fromTime: true,
      tillTime: true,
      isActive: true,
    },
  }); */

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.grantId as string,
    requestBody: {
      startTime: Math.floor(targetDate.getTime() / 1000),
      endTime: Math.floor(nextDay.getTime() / 1000),
      emails: [data?.grantEmail as string],
    },
  });

  if (!data || !nylasCalendarData) {
    return notFound();
  }

  return { data, nylasCalendarData };
}

const MeetingPagee = async ({
  params,
  searchParams,
}: {
  params: { username: string; meetingName: string };
  searchParams: { date?: string; time?: string };
}) => {
  const { data, nylasCalendarData } = await getData(params.username);
  const selectedDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  const showForm = !!searchParams.date && !!searchParams.time;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4">
      {showForm ? (
        <Card>
          <CardContent className="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4">
            <div>
              <Image
                src={data.image as string}
                alt="profile"
                className="size-7 rounded-full"
                width={30}
                height={30}
              />
              <p className="text-sm font-medium text-[#6B7280] mt-1">
                Alex Fisher
              </p>
              <h1 className="text-xl font-semibold mt-2">Design Workshop</h1>
              <p className="text-sm font-medium text-[#374151]">
                A longer chat to run through design.
              </p>

              <div className="mt-5 grid gap-y-2">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#374151]">
                    Friday, 24th June
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#374151]">
                    30 Mins
                  </span>
                </p>
                <p className="flex items-center">
                  <BookMarked className="size-4 mr-2 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#374151]">
                    Google Meet
                  </span>
                </p>
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <form className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <Label>Your Name</Label>
                <Input placeholder="Your Name" />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Your Email</Label>
                <Input placeholder="johndoe@gmail.com" />
              </div>

              <SubmitButton text="Book Meeting" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-[1000px] mx-auto">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
            <div>
              <Image
                src={data.image as string}
                alt="profile"
                className="size-7 rounded-full"
                width={30}
                height={30}
              />
              <p className="text-sm font-medium text-[#6B7280] mt-1">
                Alex Fisher
              </p>
              <h1 className="text-xl font-semibold mt-2">Design Workshop</h1>
              <p className="text-sm font-medium text-[#374151]">
                A longer chat to run through design.
              </p>

              <div className="mt-5 grid gap-y-2">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#374151]">
                    Friday, 24th June
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#374151]">
                    30 Mins
                  </span>
                </p>
                <p className="flex items-center">
                  <BookMarked className="size-4 mr-2 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#374151]">
                    Google Meet
                  </span>
                </p>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <div className="my-4 md:my-0">
              <RenderCalendar />
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <TimeSlots selectedDate={selectedDate} username={params.username} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingPagee;

/* 
{
  "requestId": "1727479444-11256528-1054-41fd-bc3d-966780014445",
  "data": [
    {
      "email": "janniklasmarzahl@gmail.com",
      "object": "free_busy",
      "timeSlots": [
        {
          "object": "time_slot",
          "status": "busy",
          "startTime": 1726749000,
          "endTime": 1726752600
        }
      ]
    }
  ]
} */

/*   [
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Monday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    },
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Tuesday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    },
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Wednesday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    },
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Thursday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    },
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Friday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    },
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Saturday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    },
    {
      "User": {
        "grantId": "2be90040-43d3-4cf7-821a-b1c53a33086b",
        "grantEmail": "janniklasmarzahl@gmail.com"
      },
      "day": "Sunday",
      "fromTime": "08:00",
      "tillTime": "18:00",
      "isActive": true
    }
  ]
 */
