'use server';
import { unstable_noStore as noStore } from "next/cache";
import { Prediction } from "@/types";

export async function createPrediction (formData: FormData): Promise<Prediction> {

    noStore();

    let url = process.env.CLOUDINARY_URL ? process.env.CLOUDINARY_URL : "";

    const imageIRL = await fetch(
        url,
        {
          method: "PUT",
          body: formData.get('image') as File,
        },
      )
        .then((res) => res.json() as Promise<{secure_url: string}>)
        .then(({secure_url}) => secure_url);

    const prediction = await fetch("https://replicate.com/api/predictions", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-csrftoken": "rOWYcLLdSLgf8HrS1vsG9PaNdxX0ty2u"
      },
      "referrer": "https://replicate.com/jagilley/controlnet-hough?input=nodejs",
      "referrerPolicy": "same-origin",
      "body": JSON.stringify({
        input:{
          eta: 0, 
          image: imageIRL,
          scale:9,
          prompt: formData.get('prompt') as string,
          a_prompt:"best quality, extremely detailed, 4k octane render, sharp, bloom",
          n_prompt:"longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry",
          ddim_steps:20,
          num_samples:"1",
          value_threshold:0.1,
          image_resolution:"512",
          detect_resolution:512,
          distance_threshold:0.1
        },
          is_training:false,
          create_model:"0",
          stream:false,version:"854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b"
      }),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then((res) => {
      return res.json() as Promise<Prediction>
    });

    return prediction;
  }

export async function getPrediction(id: string) {
    noStore();
    return fetch("https://replicate.com/api/predictions/" + id, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.7",
          "baggage": "sentry-public_key=3dc017e574684610bbc7fd3b5519a4e8,sentry-trace_id=844915a00f564ef887cd235680acb11d,sentry-sample_rate=0.1",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "sentry-trace": "844915a00f564ef887cd235680acb11d-b787dc25d5b95513-0"
        },
        "referrer": "https://replicate.com/jagilley/controlnet-hough?input=nodejs&prediction=rfmgumlbpo2dj3sa5ur4jiuq4q",
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((res) => res.json() as Promise<Prediction>);
}