"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/site/Button";
import { enquirySchema, type EnquiryInput, type EnquiryResponse } from "@/lib/enquiry";

export function EnquiryForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [state, setState] = React.useState<
    { status: "idle" | "sending" } | { status: "sent"; delivered: boolean } | { status: "error"; message: string }
  >({ status: "idle" });

  const form = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", business: "", phone: "", email: "", message: defaultMessage },
  });

  // Keep the message in step with a carton the buyer is still editing, but stop
  // the moment they type their own — their words win.
  const messageDirty = form.formState.dirtyFields.message;
  React.useEffect(() => {
    if (!messageDirty) form.setValue("message", defaultMessage);
  }, [defaultMessage, messageDirty, form]);

  async function onSubmit(values: EnquiryInput) {
    setState({ status: "sending" });
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result: EnquiryResponse = await response.json();

      if (result.ok) {
        setState({ status: "sent", delivered: result.delivered });
        form.reset();
      } else {
        setState({ status: "error", message: result.error });
      }
    } catch {
      setState({
        status: "error",
        message: "Could not reach the server. Please call or use WhatsApp.",
      });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="border-l-2 border-marigold bg-sand p-6">
        <p className="text-18 text-ink">
          Thank you — your enquiry is with us. We will come back to you with rates,
          usually the same day.
        </p>
        {!state.delivered ? (
          <p className="mt-3 text-14 text-ink/70">
            This is a preview build, so nothing was actually sent. On the live
            site this enquiry would reach the unit by email.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-5 text-16 text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business (optional)</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="organization" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" autoComplete="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you looking for?</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} placeholder="Design, colourways, quantity" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {state.status === "error" ? (
          <p className="border-l-2 border-madder pl-4 text-16 text-madder">
            {state.message}
          </p>
        ) : null}

        <div>
          <Button type="submit" variant="primary" disabled={state.status === "sending"}>
            {state.status === "sending" ? "Sending" : "Send enquiry"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
