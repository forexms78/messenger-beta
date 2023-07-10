import Image from "next/image";
import AuthForm from "./AuthForm";

export default function Home() {
  return (
    <div
      className="
    flex
    min-h-full
    flex-col
    justify-center
    py-12
    sm:px-6
    lg:px-8
    bg-gray-100"
    >
      <div className="sm:mx-auto  sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height="90"
          width="90"
          className="mx-auto w-auto"
          src="/images/logo.png"
        />
        <h2
          className="
        mt-6
        text-center
        text-3xl
        font-bold
        tracking-tight
        text-gary-900"
        >
          Passion Talk!
        </h2>
      </div>

      <AuthForm />
    </div>
  );
}
