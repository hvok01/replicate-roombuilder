/* eslint-disable @next/next/no-img-element */
'use client';

import { createPrediction, getPrediction } from "@/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from "react-dom";
import { Prediction } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function FormContent() {
  const { pending } = useFormStatus();

  return (
    <>
      {
        pending && <Skeleton className="h-[480px] w-[512px]" />
      }
      <Input 
        type="file" 
        name="image"
        placeholder="https://replicate.delivery/pbxt/kfbWmK9LnJRiOqqfOmnYrrbQ4X37kysVlAMllEKManE92aegA/output_1.png"
        defaultValue="https://replicate.delivery/pbxt/kfbWmK9LnJRiOqqfOmnYrrbQ4X37kysVlAMllEKManE92aegA/output_1.png"
        accept="img/*"
      />
      <Textarea name="prompt" placeholder="An industrial bedroom"/>
      <button disabled={pending}>
        Crear
      </button>
    </>
  )
}

export default function Home() {
  const [state, fromAction] = useFormState(handleSubmit, null);

  async function handleSubmit(_state: null | Prediction, formData: FormData) {
    let prediction = await createPrediction(formData);

    while (['starting','processing'].includes(prediction.status)) {

      prediction = await getPrediction(prediction.id);

      await sleep(4000);
    }

    return prediction;
  }

  return (
    <main className="grid gap04 max-w-[512px] gap-4">
      <div>
        <span>Subi una foto de un interior y un prompt para generar una variante de tu imagen</span>
      </div>
      {
        state?.output && (
          <img src={state.output[1]} alt="previsualizacion del render" />
        )
      }
      <form action={fromAction} className="grid gap-4">
        <FormContent />
      </form>
    </main>
  );
}
