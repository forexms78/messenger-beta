"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { RiKakaoTalkFill } from "react-icons/ri";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Input from "../components/input/Input";
import AuthSocialButton from "../components/AuthSocialButton";

type Variant = "LOGIN" | "REGISTER";
const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("뭔가 잘못되었습니다!"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("로그인 되었습니다!");
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("로그인 되었습니다!");
        }
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="이름"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="이메일"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="비밀번호"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "로그인" : "회원가입"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="absolute
            inset-0
            flex
            items-center"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
            <AuthSocialButton
              icon={RiKakaoTalkFill}
              onClick={() => socialAction("kakao")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN" ? "계정이 없으면?" : "이미 계정이 있으신가요?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "회원가입하기" : "로그인"}
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div>
            💻 박병호 포트폴리오 real-time messenger 사이트
            <br />
            (meta messenger 클론 디테일 수정)
          </div>
          <div className="mt-6">
            node v20.1.0 | react v18.2.0 | next v13.4.2 | pusher-js v5.1.3 |
            zustand v4.3.8 | prisma v4.14.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
