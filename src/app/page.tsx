"use client";

import { Button } from "@/components/ui/button";
import {useMutation, useQuery} from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LandingPage() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);

  const handleClick = async () => {
    await createFile({
      name: "hello world",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Button onClick={handleClick}>click me</Button>
        {files?.map(file => <div key={file._id}>{file.name}</div>)}
    </main>
  );
}
