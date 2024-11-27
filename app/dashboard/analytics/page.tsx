import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", videos: 4 },
  { name: "Feb", videos: 7 },
  { name: "Mar", videos: 5 },
  { name: "Apr", videos: 12 },
  { name: "May", videos: 8 },
  { name: "Jun", videos: 15 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Track your video testimonial performance and usage
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium">Total Videos</h3>
              <div className="mt-2 text-2xl font-bold">51</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium">Processing Time</h3>
              <div className="mt-2 text-2xl font-bold">1.2m</div>
              <p className="text-xs text-muted-foreground">Average per video</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium">Storage Used</h3>
              <div className="mt-2 text-2xl font-bold">2.4GB</div>
              <p className="text-xs text-muted-foreground">Of 10GB quota</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium">Active Users</h3>
              <div className="mt-2 text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">In last 30 days</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Video Generation Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="videos" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}