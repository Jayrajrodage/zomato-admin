import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center bg-yellow-50">
      <SignIn />
    </div>
  );
}
