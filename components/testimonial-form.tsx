"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  text: z.string().min(20, "Testimonial must be at least 20 characters").max(500, "Testimonial cannot exceed 500 characters"),
  voice: z.string(),
});

interface TestimonialFormProps {
  onSubmit: (text: string) => void;
  imageUrl: string;
}

export function TestimonialForm({ onSubmit, imageUrl }: TestimonialFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      voice: "en-US-Neural2-F",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    try {
      // Here you would typically send the values to your API
      onSubmit(values.text);
    } catch (error) {
      console.error("Error processing testimonial:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your testimonial text here..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice Selection</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en-US-Neural2-F">Female Voice 1</SelectItem>
                  <SelectItem value="en-US-Neural2-M">Male Voice 1</SelectItem>
                  <SelectItem value="en-GB-Neural2-F">British Female</SelectItem>
                  <SelectItem value="en-GB-Neural2-M">British Male</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Continue to Preview"}
          </Button>
        </div>
      </form>
    </Form>
  );
}