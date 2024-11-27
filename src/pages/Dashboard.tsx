import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, BarChart, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your video testimonials.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/create">Create New Video</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Video className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Total Videos</h3>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Team Members</h3>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <BarChart className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Total Views</h3>
              <p className="text-2xl font-bold">1.2k</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
          <div className="space-y-4">
            {/* Add recent videos list here */}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="h-64">
            {/* Add analytics chart here */}
          </div>
        </Card>
      </div>
    </div>
  );
}