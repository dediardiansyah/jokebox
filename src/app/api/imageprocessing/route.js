import sharp from "sharp";
// import Jimp from "jimp";
// import { Jimp } from "jimp";
// import { NextResponse } from "next/server";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function floydSteinbergDither(grayArray, width, height, threshold = 48) {
  // copy ke float array supaya error propagation bekerja
  const pixels = new Float32Array(grayArray.length);
  for (let i = 0; i < grayArray.length; i++) pixels[i] = grayArray[i];

  const out = new Uint8Array(grayArray.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldPixel = pixels[idx];
      const newPixel = oldPixel < threshold ? 0 : 255;
      const err = oldPixel - newPixel;
      out[idx] = newPixel;

      // distribute error
      // Right: x+1, y       -> 7/16
      if (x + 1 < width) pixels[idx + 1] += (err * 7) / 16;
      // Down-left: x-1, y+1 -> 3/16
      if (x - 1 >= 0 && y + 1 < height) pixels[idx + width - 1] += (err * 3) / 16;
      // Down: x, y+1        -> 5/16
      if (y + 1 < height) pixels[idx + width] += (err * 5) / 16;
      // Down-right: x+1,y+1 -> 1/16
      if (x + 1 < width && y + 1 < height) pixels[idx + width + 1] += (err * 1) / 16;
    }
  }

  return out; // values 0 or 255
}

export async function POST(req, res) {
  const body = await req.json();
  if (typeof body !== "object" || body === null) {
    return json({ error: "Invalid body" }, 400);
  }
  console.log("Received body for image processing");
  const { base64 } = body;

  // 2. Buat Buffer dari Base64
  try {
    const imgBuffer = Buffer.from(base64, "base64");

    // Decode image to raw RGBA
    const { data: raw, info } = await sharp(imgBuffer)
      // .modulate({ brightness: Number(2) })
      .modulate({ brightness: 1.7, saturation: 1.2 })
      .linear(1.2, -10)
      .ensureAlpha() // ensure 4 channels
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info; // channels should be 4 (RGBA) after ensureAlpha

    // Convert RGBA buffer -> grayscale array (0..255)
    const gray = new Uint8ClampedArray(width * height);
    for (let i = 0, j = 0; i < raw.length; i += channels, j++) {
      const r = raw[i];
      const g = raw[i + 1];
      const b = raw[i + 2];
      // standard luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      gray[j] = lum;
    }

    // Apply Floyd–Steinberg dither -> returns 0/255 array
    const dithered = floydSteinbergDither(gray, width, height, 128); //128);

    // Build RGBA output buffer (R,G,B,A) from dithered grayscale
    const outBuffer = Buffer.alloc(width * height * 4);
    for (let i = 0, j = 0; j < dithered.length; j++, i += 4) {
      const v = dithered[j]; // 0 or 255
      outBuffer[i] = v;
      outBuffer[i + 1] = v;
      outBuffer[i + 2] = v;
      outBuffer[i + 3] = 255; // fully opaque
    }

    // Encode back to PNG (bisa juga ke JPEG tapi PNG cocok untuk 1-bit-like output)
    const pngBuffer = await sharp(outBuffer, {
      raw: { width, height, channels: 4 },
    })
      .png()
      .toBuffer();

    const outBase64 = pngBuffer.toString("base64");
    const dataUri = outBase64; //`data:image/png;base64,${outBase64}`;

    return json({ data: dataUri }, 200);

    // res.status(200).json({
    //   data: dataUri,
    // });
  } catch (error) {
    console.error("Jimp Processing Error:", error);
    // res.status(500).json({ message: "Image dithering failed on server." });
    return json({ error: true }, 500);
  }

  // const ditheredBase64 = await sharp(Buffer.from(base64, "base64"))
  //   .png({
  //     dither: 0.2,
  //     colours: 2, // Limit to 2 colors (black and white)
  //     palette: true, // Enable dithering for palette-based output
  //   })
  //   .toBuffer()
  //   .then((buf) => buf.toString("base64"));

  // return json({ data: ditheredBase64 }, 200);
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
