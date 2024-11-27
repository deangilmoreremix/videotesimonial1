import { Suspense } from "react";
import { VideoTestimonialCreator } from "@/components/video-testimonial-creator";
import { VoiceAnalytics } from "@/components/voice-analytics";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-[120px]" />}>
          <VoiceAnalytics />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="h-[450px]">
            <VideoTestimonialCreator />
          </div>
        </Card>
        <Card className="col-span-3">
          <div className="h-[450px]">
            {/* Recent Activity Component will go here */}
          </div>
        </Card>
      </div>
    </div>
  );
}