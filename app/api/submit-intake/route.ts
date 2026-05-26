import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const clientName =
      body.parentName ||
      body.client_name ||
      body.childName ||
      body.legalGlobalName ||
      "Unknown Client";

    const email =
      body.email ||
      body.parentEmail ||
      "";

    const phone =
      body.phone ||
      body.parentPhone ||
      "";

    const payload = {
      client_name: clientName,
      email,
      phone,
      form_data: body,
    };

    const { data, error } = await supabase
      .from("intake_submissions")
      .insert([payload])
      .select();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.EDEN_NOTIFY_EMAIL!,
        subject: "New Eden ABA Intake Submission",
        html: `
          <h2>New Intake Submission</h2>

          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <p>A new intake form was submitted successfully.</p>
        `,
      });
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}