import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your video testimonial projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <Folder className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Customer Testimonials Q1</h3>
          <p className="text-muted-foreground mb-4">
            Collection of customer success stories
          </p>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>12 videos</span>
            <span>Updated 2 days ago</span>
          </div>
        </Card>
        {/* Add more project cards */}
      </div>
    </div>
  );
}