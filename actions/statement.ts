"use server";

import { db } from "@/lib/db";

export async function createStatement(formData: FormData) {
  try {
    const bankId = formData.get("bankId")?.toString();
    const sl = Number(formData.get("sl"));
    const date = new Date(formData.get("date") as string);
    const particular = formData.get("particular")?.toString();
    const instrumentNo = formData.get("instrumentNo")?.toString();

    const withdraw = formData.get("withdraw")
      ? Number(formData.get("withdraw"))
      : null;

    const deposit = formData.get("deposit")
      ? Number(formData.get("deposit"))
      : null;

    const balance = formData.get("balance")
      ? Number(formData.get("balance"))
      : null;

    const remarks = formData.get("remarks")?.toString() || null;

    if (!bankId || !sl || !particular) {
      throw new Error("Bank ID, SL, and Particular are required.");
    }

    const statement = await db.statement.create({
      data: {
        bankId,
        sl,
        date,
        particular,
        instrumentNo,
        withdraw,
        deposit,
        balance,
        remarks,
      },
    });

    // // UI refresh
    // revalidatePath(`/banks/${bankId}`);

    return { success: true, statement };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}
