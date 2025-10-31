import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Phone } from "lucide-react";

// /app/api/transactions/route.js

const dataPath = path.resolve(process.cwd(), "data", "transactions.json");

async function readData() {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeData([]); // create file if missing
      return [];
    }
    throw err;
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const items = await readData();

    if (id) {
      const item = items.find((t) => t.id === id);
      if (!item) return json({ error: "Not found" }, 404);
      return json(item);
    }

    return json(items);
  } catch (err) {
    return json({ error: err.message || "Server error" }, 500);
  }
}

export async function POST(req, res) {
  //   try {
  const body = await req.json();
  // basic validation
  if (typeof body !== "object" || body === null) {
    return json({ error: "Invalid body" }, 400);
  }

  const { amount, description, id } = body;

  //   console.log("Received body:", amount);
  //   console.log("Received body:", description);
  //   console.log("Received body:", id);
  // //   return json({ data: "Well Received" }, 200);
  try {
    const midtrans = await fetch("https://app.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "BASIC " + btoa("Mid-server-qm8iNZbbMFs1MwZTxVvP11LE:"),
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: id + "-" + Math.floor(Math.random() * 10000),
          gross_amount: amount,
        },
        customer_details: {
          first_name: "Dedi",
          last_name: "Ardiansyah",
          email: "dedi@gmail.com",
          Phone: "08123456789",
        },
        enabled_payments: [
          //   "echannel",
          //   "gopay",
          //   "qr",
          "other_qris",
          //   //   "credit_card",
          //   //   "shopeepay",
          //   //   "permata_va",
          //   //   "bca_va",
          //   //   "bni_va",
          //   //   "bri_va",
          //   //   "echannel",
          //   //   "other_va",
          //   //   "Indomaret",
          //   //   "alfamart",
          //   //   "akulaku",
        ],
        expiry: {
          unit: "minutes",
          duration: 180,
        },
        callbacks: {
          finish: "https://jokebox.com/my_custom_finish/?name=Customer01",
        },
      }),
    });

    const resMidtrans = await midtrans.json();
    console.log("Midtrans response:", resMidtrans);
    return json({ message: "Transaction created", data: resMidtrans }, 201);
  } catch (err) {
    console.error("Error creating Midtrans transaction:", err);
    return json({ message: "Transaction request sent to Midtrans" }, 500);
  }

  // .then((resMidtrans) => {
  //   console.log("Midtrans response status:", resMidtrans);
  //   //   console.log(resMidtrans.json());
  //   //   return json({ data: null, message: "Transactions Success" }, 200);
  //   //   return res.json();
  //   //   console.log(res);
  //   //   res.status(200).json({ message: "Data received", data: null });
  //   //   return json({ error: "Missing/invalid fields (amount, type required)" }, 200);
  //   //   return NextResponse.json({ message: "Title and content are required" }, { status: 200 });
  //   return NextResponse.json(res, { status: 201 });
  // })
  // .catch((err) => {
  //   console.error("Error creating Midtrans transaction:", err);
  //   //   return res.json({ message: "Something Error", error: JSON.stringify(err) }, 500);
  //   // res.status(500).json({ message: "Error received", data: null });
  //   //   return NextResponse.json({ message: "Title and content are required" }, { status: 200 });
  //   return NextResponse.json({ error: err }, { status: 200 });
  // });

  //     if (amount == null || !["credit", "debit"].includes(type)) {
  //       return json({ error: "Missing/invalid fields (amount, type required)" }, 400);
  //     }

  //     const items = await readData();
  //     const newItem = {
  //       id: randomUUID(),
  //       amount,
  //       description: description || "",
  //       type,
  //       createdAt: new Date().toISOString(),
  //     };

  //     items.push(newItem);
  //     await writeData(items);

  //     return json(newItem, 201);
  //   } catch (err) {
  //     return json({ error: err.message || "Server error" }, 500);
  //   }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const idFromQuery = url.searchParams.get("id");
    const body = await req.json();

    const id = idFromQuery || body?.id;
    if (!id) return json({ error: "Missing id" }, 400);

    const items = await readData();
    const idx = items.findIndex((t) => t.id === id);
    if (idx === -1) return json({ error: "Not found" }, 404);

    // allow updating amount, description, type
    const updated = {
      ...items[idx],
      amount: body.amount ?? items[idx].amount,
      description: body.description ?? items[idx].description,
      type: body.type ?? items[idx].type,
      updatedAt: new Date().toISOString(),
    };

    items[idx] = updated;
    await writeData(items);

    return json(updated);
  } catch (err) {
    return json({ error: err.message || "Server error" }, 500);
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, 400);

    const items = await readData();
    const idx = items.findIndex((t) => t.id === id);
    if (idx === -1) return json({ error: "Not found" }, 404);

    const [deleted] = items.splice(idx, 1);
    await writeData(items);

    return json({ success: true, deleted });
  } catch (err) {
    return json({ error: err.message || "Server error" }, 500);
  }
}
